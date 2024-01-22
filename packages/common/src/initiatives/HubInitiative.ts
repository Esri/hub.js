import { DEFAULT_INITIATIVE } from "./defaults";
import { getEditorConfig } from "../core/schemas/getEditorConfig";
import { IEntityEditorContext } from "../core/types/HubEntityEditor";
import { cloneObject } from "../util";
import {
  createInitiative,
  deleteInitiative,
  editorToInitiative,
  fetchInitiative,
  updateInitiative,
} from "./HubInitiatives";

import { Catalog } from "../search/Catalog";
import { IArcGISContext } from "../ArcGISContext";
import { HubItemEntity } from "../core/HubItemEntity";
import { InitiativeEditorType } from "./_internal/InitiativeSchema";
import { IWithMetricsBehavior } from "../core/behaviors/IWithMetricsBehavior";
import { getEntityMetrics } from "../metrics/getEntityMetrics";
import { resolveMetric } from "../metrics/resolveMetric";
import {
  IConvertToCardModelOpts,
  IHubCardViewModel,
} from "../core/types/IHubCardViewModel";
import { initiativeToCardModel } from "./view";
import {
  IHubInitiative,
  IWithCatalogBehavior,
  IWithStoreBehavior,
  IWithSharingBehavior,
  IResolvedMetric,
  IWithCardBehavior,
  IWithEditorBehavior,
  IHubInitiativeEditor,
  SettableAccessLevel,
} from "../core";
import { IEditorConfig } from "../core/schemas/types";
import { enrichEntity } from "../core/enrichEntity";
import { IGroup } from "@esri/arcgis-rest-types";
import { getProp } from "../objects";
import { upsertResource } from "../resources/upsertResource";
import { doesResourceExist } from "../resources/doesResourceExist";
import { removeResource } from "../resources/removeResource";

/**
 * Hub Initiative Class
 */
export class HubInitiative
  extends HubItemEntity<IHubInitiative>
  implements
    IWithStoreBehavior<IHubInitiative>,
    IWithCatalogBehavior,
    IWithMetricsBehavior,
    IWithSharingBehavior,
    IWithCardBehavior,
    IWithEditorBehavior
{
  private _catalog: Catalog;

  /**
   * Private constructor so we don't have `new` all over the place. Allows for
   * more flexibility in how we create the HubInitiativeManager over time.
   * @param context
   */
  private constructor(entity: IHubInitiative, context: IArcGISContext) {
    super(entity, context);
    this._catalog = Catalog.fromJson(entity.catalog, this.context);
  }

  /**
   * Catalog instance for this Initiative. Note: Do not hold direct references to this object; always access it from the Initiative.
   * @returns Catalog
   */
  get catalog(): Catalog {
    return this._catalog;
  }

  /**
   * Create an instance from an IHubInitiative object
   * @param json - JSON object to create a HubInitiative from
   * @param context - ArcGIS context
   * @returns
   */
  static fromJson(
    json: Partial<IHubInitiative>,
    context: IArcGISContext
  ): HubInitiative {
    // merge what we have with the default values
    const pojo = this.applyDefaults(json, context);
    return new HubInitiative(pojo, context);
  }

  /**
   * Create a new HubInitiative, returning a HubInitiative instance.
   * Note: This does not persist the Initiative into the backing store
   * @param partialInitiative
   * @param context
   * @returns
   */
  static async create(
    partialInitiative: Partial<IHubInitiative>,
    context: IArcGISContext,
    save: boolean = false
  ): Promise<HubInitiative> {
    const pojo = this.applyDefaults(partialInitiative, context);
    // return an instance of HubInitiative
    const instance = HubInitiative.fromJson(pojo, context);
    if (save) {
      await instance.save();
    }
    return instance;
  }

  /**
   * Fetch an Initiative from the backing store and return a HubInitiative instance.
   * @param identifier - slug or item id
   * @param context
   * @returns
   */
  static async fetch(
    identifier: string,
    context: IArcGISContext
  ): Promise<HubInitiative> {
    // fetch by id or slug
    try {
      const entity = await fetchInitiative(identifier, context.requestOptions);
      // create an instance of HubInitiative from the entity
      return HubInitiative.fromJson(entity, context);
    } catch (ex) {
      if (
        (ex as Error).message ===
        "CONT_0001: Item does not exist or is inaccessible."
      ) {
        throw new Error(`Initiative not found.`);
      } else {
        throw ex;
      }
    }
  }

  private static applyDefaults(
    partialInitiative: Partial<IHubInitiative>,
    context: IArcGISContext
  ): IHubInitiative {
    // ensure we have the orgUrlKey
    if (!partialInitiative.orgUrlKey) {
      partialInitiative.orgUrlKey = context.portal.urlKey;
    }
    // extend the partial over the defaults
    const pojo = {
      ...DEFAULT_INITIATIVE,
      ...partialInitiative,
    } as IHubInitiative;
    return pojo;
  }

  /**
   * Apply a new state to the instance
   * @param changes
   */
  update(changes: Partial<IHubInitiative>): void {
    if (this.isDestroyed) {
      throw new Error("HubInitiative is already destroyed.");
    }
    // merge partial onto existing entity
    this.entity = { ...this.entity, ...changes };

    // update internal instances
    if (changes.catalog) {
      this._catalog = Catalog.fromJson(this.entity.catalog, this.context);
    }
  }

  /**
   * Save the HubInitiative to the backing store.
   * Currently Initiatives are stored as Items in Portal
   * @returns
   */
  async save(): Promise<void> {
    if (this.isDestroyed) {
      throw new Error("HubInitiative is already destroyed.");
    }
    // get the catalog, and permission configs
    this.entity.catalog = this._catalog.toJson();

    if (this.entity.id) {
      // update it
      this.entity = await updateInitiative(
        this.entity,
        this.context.userRequestOptions
      );
    } else {
      // create it
      this.entity = await createInitiative(
        this.entity,
        this.context.userRequestOptions
      );
    }

    // call the after save hook on superclass
    await super.afterSave();

    return;
  }

  /**
   * Delete the HubInitiative from the store
   * set a flag to indicate that it is destroyed
   * @returns
   */
  async delete(): Promise<void> {
    if (this.isDestroyed) {
      throw new Error("HubInitiative is already destroyed.");
    }
    this.isDestroyed = true;
    // Delegate to module fn
    await deleteInitiative(this.entity.id, this.context.userRequestOptions);
  }

  /**
   * Resolve a single metric for this metric
   * @param metricId
   * @returns
   */
  resolveMetric(metricId: string): Promise<IResolvedMetric> {
    const metrics = getEntityMetrics(this.entity);
    const metric = metrics.find((m) => m.id === metricId);
    // TODO: Add caching
    if (metric) {
      return resolveMetric(metric, this.context);
    } else {
      throw new Error(`Metric ${metricId} not found.`);
    }
  }

  /**
   * Convert the initiative entity into a card view model that
   * can be consumed by the suite of hub gallery components
   *
   * @param opts view model options
   */
  convertToCardModel(opts?: IConvertToCardModelOpts): IHubCardViewModel {
    return initiativeToCardModel(this.entity, this.context, opts);
  }

  /*
   * Get a specifc editor config for the HubInitiative entity.
   * @param i18nScope translation scope to be interpolated into the uiSchema
   * @param type editor type - corresonds to the returned uiSchema
   * @param options optional hash of dynamic uiSchema element options
   */
  async getEditorConfig(
    i18nScope: string,
    type: InitiativeEditorType
  ): Promise<IEditorConfig> {
    // delegate to the schema subsystem
    return getEditorConfig(i18nScope, type, this.entity, this.context);
  }

  /**
   * Return the initiative as an editor object
   * @param editorContext
   * @returns
   */
  async toEditor(
    editorContext: IEntityEditorContext = {},
    include: string[] = []
  ): Promise<IHubInitiativeEditor> {
    // 1. optionally enrich entity and cast to editor
    const editor = include.length
      ? ((await enrichEntity(
          cloneObject(this.entity),
          include,
          this.context.hubRequestOptions
        )) as IHubInitiativeEditor)
      : (cloneObject(this.entity) as IHubInitiativeEditor);

    // add the groups array that we'll use to auto-share on save
    editor._groups = [];

    // 2. Apply transforms to relevant entity values so they
    // can be consumed by the editor
    /**
     * on initiative creation, we want to pre-populate the sharing
     * field with the core and collaboration groups if the user
     * has the appropriate shareToGroup portal privilege
     *
     * TODO: we should re-evaluate this "auto-populate" pattern
     */
    const { access: canShare } = this.checkPermission(
      "platform:portal:user:shareToGroup"
    );
    if (!editor.id && canShare) {
      const currentUserGroups: IGroup[] =
        getProp(this.context, "currentUser.groups") || [];
      const defaultShareWithGroups = [
        editorContext.contentGroupId,
        editorContext.collaborationGroupId,
      ].reduce((acc, groupId) => {
        const group = currentUserGroups.find((g: IGroup) => g.id === groupId);
        const canShareToGroup =
          !!group &&
          (!group.isViewOnly ||
            (group.isViewOnly &&
              ["owner", "admin"].includes(group.memberType)));

        canShareToGroup && acc.push(groupId);
        return acc;
      }, []);
      editor._groups = [...editor._groups, ...defaultShareWithGroups];
    }
    return editor;
  }

  /**
   * Load the initiative from the editor object
   * @param editor
   * @returns
   */
  async fromEditor(editor: IHubInitiativeEditor): Promise<IHubInitiative> {
    const autoShareGroups = editor._groups || [];
    const isCreate = !editor.id;

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

    // extract out things we don't want to persist directly
    // b/c the first thing we do is create/update the initiative
    const featuredImage = editor.view.featuredImage;
    delete editor.view.featuredImage;

    // convert back to an entity
    const entity = editorToInitiative(editor, this.context.portal);

    // handle featured image
    // If there is a featured image from the editor, we need to...
    if (featuredImage) {
      let featuredImageUrl: string | null = null;
      // ...upsert it if it's a blob
      if (featuredImage.blob) {
        featuredImageUrl = await upsertResource(
          entity.id,
          entity.owner,
          featuredImage.blob,
          "featuredImage.png",
          this.context.userRequestOptions
        );
      } else if (
        await doesResourceExist(
          entity.id,
          "featuredImage.png",
          this.context.userRequestOptions
        )
      ) {
        await removeResource(
          entity.id,
          "featuredImage.png",
          entity.owner,
          this.context.userRequestOptions
        );
      }

      entity.view = {
        ...entity.view,
        featuredImageUrl,
      };
    }

    // create it if it does not yet exist...
    if (isCreate) {
      // this allows the featured image functions to work
      this.entity = await createInitiative(
        entity,
        this.context.userRequestOptions
      );
    } else {
      // ...otherwise, update the in-memory entity and save it
      this.entity = entity;
      await this.save();
    }

    /**
     * operations that are only relevant to the create workflow.
     * if these ever become part of the edit experience, we can remove the conditional
     */
    if (isCreate) {
      await this.setAccess(editor.access as SettableAccessLevel);
      // share the entity with the configured groups
      if (autoShareGroups.length) {
        await Promise.all(
          autoShareGroups.map((id: string) => {
            return this.shareWithGroup(id);
          })
        );
      }
    }

    return this.entity;
  }
}
