import {
  IHubSite,
  IWithPermissionBehavior,
  IWithCatalogBehavior,
  PermissionManager,
  IWithStoreBehavior,
  IWithSharingBehavior,
} from "../core";

import { Catalog } from "../search/Catalog";
import { IArcGISContext } from "../ArcGISContext";
import { HubItemEntity } from "../core/HubItemEntity";

import { DEFAULT_SITE } from "./defaults";
import { createSite, deleteSite, fetchSite, updateSite } from "./HubSites";

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
    IWithSharingBehavior
{
  private _catalog: Catalog;
  private _permissionManager: PermissionManager;
  /**
   * Private constructor so we don't have `new` all over the place. Allows for
   * more flexibility in how we create the HubSiteManager over time.
   * @param context
   */
  private constructor(site: IHubSite, context: IArcGISContext) {
    super(site, context);
    this._catalog = Catalog.fromJson(site.catalog, this.context);
    this._permissionManager = PermissionManager.fromJson(
      site.permissions,
      this.context
    );
  }
  /**
   * Catalog instance for this project. Note: Do not hold direct references to this object; always access it from the project.
   * @returns
   */
  get catalog(): Catalog {
    return this._catalog;
  }

  /**
   * PermissionManager instance for this project. Note: Do not hold direct references to this object; always access it from the project.
   * @returns
   */
  get permissions(): PermissionManager {
    return this._permissionManager;
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
   * Note: This does not persist the Project into the backing store
   * @param partialSite
   * @param context
   * @returns
   */
  static async create(
    partialSite: Partial<IHubSite>,
    context: IArcGISContext,
    save: boolean = false
  ): Promise<HubSite> {
    throw new Error("HubSite.create Not implemented");
  }

  /**
   * Fetch a Project from the backing store and return a HubSite instance.
   * @param identifier - Identifier of the project to load
   * @param context
   * @returns
   */
  static async fetch(
    identifier: string,
    context: IArcGISContext
  ): Promise<HubSite> {
    // fetch the project by id or slug
    try {
      const project = await fetchSite(identifier, context.hubRequestOptions);
      // create an instance of HubSite from the project
      return HubSite.fromJson(project, context);
    } catch (ex) {
      if (
        (ex as Error).message ===
        "CONT_0001: Item does not exist or is inaccessible."
      ) {
        throw new Error(`Project not found.`);
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
      partialSite.orgUrlKey = context.portal.urlKey;
    }
    // extend the partial over the defaults
    const pojo = { ...DEFAULT_SITE, ...partialSite } as IHubSite;
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
    if (changes.permissions) {
      this._permissionManager = PermissionManager.fromJson(
        this.entity.permissions,
        this.context
      );
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
    this.entity.permissions = this._permissionManager.toJson();

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
}
