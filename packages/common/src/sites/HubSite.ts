import {
  IHubSite,
  IWithPermissionBehavior,
  IWithCatalogBehavior,
  IWithStoreBehavior,
  IWithSharingBehavior,
  IWithVersioningBehavior,
} from "../core";

import { Catalog } from "../search";
import { IArcGISContext } from "../ArcGISContext";
import { HubItemEntity } from "../core/HubItemEntity";
import { getEditorConfig } from "../core/schemas/getEditorConfig";
import { enrichEntity } from "../core/schemas/internal/enrichEntity";
import {
  IEditorConfig,
  IWithEditorBehavior,
} from "../core/behaviors/IWithEditorBehavior";
import { DEFAULT_SITE } from "./defaults";
import {
  createSite,
  deleteSite,
  ENTERPRISE_SITE_ITEM_TYPE,
  fetchSite,
  HUB_SITE_ITEM_TYPE,
  updateSite,
} from "./HubSites";
import { IEntityEditorContext } from "../core/types/HubEntityEditor";
import { IContainsResponse, IDeepCatalogInfo, IHubCatalog } from "../search";
import { deepContains } from "../core/_internal/deepContains";

import {
  applyVersion,
  createVersion,
  deleteVersion,
  getVersion,
  ICreateVersionOptions,
  IVersion,
  IVersionMetadata,
  searchVersions,
  updateVersion,
  updateVersionMetadata,
} from "../versioning";

import { cloneObject } from "../util";

import { PropertyMapper } from "../core/_internal/PropertyMapper";
import { getPropertyMap } from "./_internal/getPropertyMap";

import { IHubSiteEditor, IModel, setProp, SettableAccessLevel } from "../index";
import { SiteEditorType } from "./_internal/SiteSchema";

/**
 * Hub Site Class
 * NOTE: This is a minimal implementation. Create operations are not supported at this time
 */
export class HubSite
  extends HubItemEntity<IHubSite>
  implements
    IWithStoreBehavior<IHubSite>,
    IWithPermissionBehavior,
    IWithCatalogBehavior,
    IWithSharingBehavior,
    IWithVersioningBehavior,
    IWithEditorBehavior
{
  private _catalog: Catalog;

  private _catalogCache: Record<string, IHubCatalog> = {};
  /**
   * Private constructor so we don't have `new` all over the place. Allows for
   * more flexibility in how we create the HubSiteManager over time.
   * @param context
   */
  private constructor(site: IHubSite, context: IArcGISContext) {
    super(site, context);
    this._catalog = Catalog.fromJson(site.catalog, this.context);
  }

  /**
   * Catalog instance for this site. Note: Do not hold direct references to this object; always access it from the site.
   * @returns
   */
  get catalog(): Catalog {
    return this._catalog;
  }

  /**
   * Create an instance from an IHubSite object
   * @param json - JSON object to create a HubSite from
   * @param context - ArcGIS context
   * @returns
   */
  static fromJson(json: Partial<IHubSite>, context: IArcGISContext): HubSite {
    // merge what we have with the default values
    const pojo = this.applyDefaults(json, context);
    return new HubSite(pojo, context);
  }

  /**
   *
   * NOT IMPLEMENTED YET: Create a new HubSite, returning a HubSite instance.
   * By default, this does not save the site to the backing store.
   * @param partialSite
   * @param context
   * @returns
   */
  static async create(
    partialSite: Partial<IHubSite>,
    context: IArcGISContext,
    save: boolean = false
  ): Promise<HubSite> {
    const pojo = this.applyDefaults(partialSite, context);
    // return an instance of HubProject
    const instance = HubSite.fromJson(pojo, context);
    if (save) {
      await instance.save();
    }
    return instance;
  }

  /**
   * Fetch a Site from the backing store and return a HubSite instance.
   * @param identifier - Identifier of the site to load
   * @param context
   * @returns
   */
  static async fetch(
    identifier: string,
    context: IArcGISContext
  ): Promise<HubSite> {
    // fetch the site by id or slug
    try {
      const site = await fetchSite(identifier, context.hubRequestOptions);
      // create an instance of HubSite from the site
      return HubSite.fromJson(site, context);
    } catch (ex) {
      if (
        (ex as Error).message ===
        "CONT_0001: Item does not exist or is inaccessible."
      ) {
        throw new Error(`Site not found.`);
      } else {
        throw ex;
      }
    }
  }

  private static applyDefaults(
    partialSite: Partial<IHubSite>,
    context: IArcGISContext
  ): IHubSite {
    // ensure we have the orgUrlKey
    if (!partialSite.orgUrlKey) {
      partialSite.orgUrlKey = context.portal?.urlKey;
    }
    // extend the partial over the defaults
    const pojo = { ...DEFAULT_SITE, ...partialSite } as IHubSite;
    pojo.type = context.isPortal
      ? ENTERPRISE_SITE_ITEM_TYPE
      : HUB_SITE_ITEM_TYPE;
    return pojo;
  }

  /**
   * Apply a new state to the instance
   * @param changes
   */
  update(changes: Partial<IHubSite>): void {
    if (this.isDestroyed) {
      throw new Error("HubSite is already destroyed.");
    }
    // merge partial onto existing entity
    this.entity = { ...this.entity, ...changes };

    // update internal instances
    if (changes.catalog) {
      this._catalog = Catalog.fromJson(this.entity.catalog, this.context);
    }
  }

  /**
   * Save the HubSite to the backing store.
   * Currently Sites are stored as Items in Portal
   * @returns
   */
  async save(): Promise<void> {
    if (this.isDestroyed) {
      throw new Error("HubSite is already destroyed.");
    }
    // get the catalog, and permission configs
    this.entity.catalog = this._catalog.toJson();

    if (this.entity.id) {
      // update it
      this.entity = await updateSite(
        this.entity,
        this.context.hubRequestOptions
      );
    } else {
      // create it
      this.entity = await createSite(
        this.entity,
        this.context.hubRequestOptions
      );
    }
    // call the after save hook on superclass
    await super.afterSave();

    return;
  }

  /**
   * Delete the HubSite from the store
   * set a flag to indicate that it is destroyed
   * @returns
   */
  async delete(): Promise<void> {
    if (this.isDestroyed) {
      throw new Error("HubSite is already destroyed.");
    }
    this.isDestroyed = true;
    // Delegate to module fn
    await deleteSite(this.entity.id, this.context.userRequestOptions);
  }

  /**
   * Check if a particular entity is contained is this HubSite.
   *
   * By default, this checks the Site catalog for the entity, by executing a search.
   *
   * Transitive containment is supported by passing in an array of `IDeepCatalogInfo`
   * objects, in the order of the containment hierarchy.
   *
   * Scenario:
   * - Site `00a`'s Catalog contains Initiative `00b`.
   * - Initiative `00b`'s Catalog contains Site `00c`.
   * - Site `00c`'s catalog contains Dataset `00d`.
   *
   * Check if Dataset `00d` can be displayed in Site `00a`, pass in the following
   * ```js
   * [
   *  {id: '00c', entityType:"item"}, // site
   *  {id: '00b', entityType:"item"}, // initiative
   * ]
   * ```
   * The site catalog and id will be added in automatically.
   *
   * If you already have the `IHubCatalog` for the site or initiative, you can
   * pass that in as well, and it will save a request.
   *
   * This function will also build a cache of the catalogs so subsequent calls
   * will be faster.
   * @param identifier
   * @param hierarchy
   * @returns
   */
  async contains(
    identifier: string,
    hierarchy: IDeepCatalogInfo[] = []
  ): Promise<IContainsResponse> {
    // Apply any cached catalogs
    hierarchy.forEach((entry: IDeepCatalogInfo) => {
      if (this._catalogCache[entry.id]) {
        entry.catalog = this._catalogCache[entry.id];
      }
    });

    // Add the site and it's catalog into the hierarchy as the last entry
    const hierarchyWithSiteCatalog = [
      ...hierarchy,
      ...[
        {
          id: this.id,
          entityType: "item",
          catalog: this._catalog.toJson(),
        } as IDeepCatalogInfo,
      ],
    ];
    // delegate to fn
    const response = await deepContains(
      identifier,
      hierarchyWithSiteCatalog,
      this.context
    );
    // cache the catalogs
    Object.keys(response.catalogInfo).forEach((key) => {
      // don't cache the site's catalog
      if (key !== this.id) {
        this._catalogCache[key] = response.catalogInfo[key].catalog;
      }
    });

    return response;
  }

  //#region IWithVersioningBehavior

  /*
    NOTE: we will be further fleshing this out in the near future
      we will want to make it easier to apply a version to a site and work with it
      at a minimum, we will probably want something like this:
      async applyVersion(versionOrIdentifier: string | IVersion) {
        const version = typeof versionOrIdentifier === "string" ? await this.getVersion(versionOrIdentifier) : versionOrIdentifier;
        const mapper = new PropertyMapper<IHubSite>(getPropertyMap());
        const model = mapper.objectToModel(this.entity, {} as IModel);
        const versionedModel = applyVersion(model, version);
        const versionedEntity = mapper.modelToObject(versionedModel, this.entity);
        return this.update(versionedEntity);
      }
  */

  /**
   * Gets all the versions of the site
   * @returns
   */
  async searchVersions(): Promise<IVersionMetadata[]> {
    return searchVersions(this.entity.id, this.context.userRequestOptions);
  }

  /**
   * Gets the specified version of the site
   * @param versionId
   * @returns
   */
  async getVersion(versionId: string): Promise<IVersion> {
    return getVersion(
      this.entity.id,
      versionId,
      this.context.userRequestOptions
    );
  }

  /**
   * Creates a new version of the site
   * @param options
   * @returns
   */
  async createVersion(options?: ICreateVersionOptions): Promise<IVersion> {
    const mapper = new PropertyMapper<IHubSite, IModel>(getPropertyMap());
    const model = mapper.entityToStore(this.entity, {} as IModel);
    return createVersion(model, this.context.userRequestOptions, options);
  }

  /**
   * Updates the specified version of the site
   * @param version
   * @returns
   */
  async updateVersion(version: IVersion): Promise<IVersion> {
    const mapper = new PropertyMapper<IHubSite, IModel>(getPropertyMap());
    const model = mapper.entityToStore(this.entity, {} as IModel);
    return updateVersion(model, version, this.context.userRequestOptions);
  }

  /**
   * Updates the specified version's metadata
   * @param version
   * @returns
   */
  async updateVersionMetadata(
    version: IVersionMetadata
  ): Promise<IVersionMetadata> {
    return updateVersionMetadata(
      this.entity.id,
      version,
      this.entity.owner,
      this.context.userRequestOptions
    );
  }

  /**
   * Deletes the specified version of the entity
   * @returns
   */
  async deleteVersion(versionId: string): Promise<{ success: boolean }> {
    return deleteVersion(
      this.entity.id,
      versionId,
      this.entity.owner,
      this.context.userRequestOptions
    );
  }

  //#endregion IWithVersioningBehavior

  /*
   * Get the editor config for the HubProject entity.
   * @param i18nScope translation scope to be interpolated into the uiSchema
   * @param type editor type - corresonds to the returned uiSchema
   * @param options optional hash of dynamic uiSchema element options
   */
  async getEditorConfig(
    i18nScope: string,
    type: SiteEditorType
  ): Promise<IEditorConfig> {
    // delegate to the schema subsystem
    return getEditorConfig(i18nScope, type, this.entity, this.context);
  }

  /**
   * Return the project as an editor object
   * @param editorContext
   * @returns
   */
  async toEditor(
    editorContext: IEntityEditorContext = {},
    include: string[] = []
  ): Promise<IHubSiteEditor> {
    // 1. optionally enrich entity and cast to editor
    const editor = include.length
      ? ((await enrichEntity(
          cloneObject(this.entity),
          include,
          this.context.hubRequestOptions
        )) as IHubSiteEditor)
      : (cloneObject(this.entity) as IHubSiteEditor);

    // 2. Apply transforms to relevant entity values so they
    // can be consumed by the editor
    setProp(
      "_followers.showFollowAction",
      this.entity.features["hub:site:feature:follow"],
      editor
    );

    return editor;
  }

  /**
   * Load the project from the editor object
   * @param editor
   * @returns
   */
  async fromEditor(editor: IHubSiteEditor): Promise<IHubSite> {
    const isCreate = !editor.id;

    // 1. Perform any pre-save operations e.g. storing
    // image resources on the item, setting access, etc.

    // Setting the thumbnailCache will ensure that
    // the thumbnail is updated on next save
    if (editor._thumbnail) {
      if (editor._thumbnail.blob) {
        this.thumbnailCache = {
          file: editor._thumbnail.blob,
          filename: editor._thumbnail.fileName,
          clear: false,
        };
      } else {
        this.thumbnailCache = {
          clear: true,
        };
      }
    }

    delete editor._thumbnail;

    // set the followers group access
    if (editor._followers?.groupAccess) {
      await this.setFollowersGroupAccess(
        editor._followers.groupAccess as SettableAccessLevel
      );
    }

    // 2. Convert editor values back to an entity e.g. apply
    // any reverse transforms used in the toEditor method
    const entity = cloneObject(editor) as IHubSite;

    entity.features = {
      ...entity.features,
      "hub:site:feature:follow": editor._followers?.showFollowAction,
    };

    // copy the location extent up one level
    entity.extent = editor.location?.extent;

    // 3. create or update the in-memory entity and save
    if (isCreate) {
      throw new Error("Cannot create content using the Editor.");
    } else {
      this.entity = entity;
      await this.save();
    }

    return this.entity;
  }
}
