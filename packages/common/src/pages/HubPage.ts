import {
  IHubPage,
  // IWithPermissionBehavior,
  // IWithStoreBehavior,
  // IWithSharingBehavior,
} from "../core";

import { IArcGISContext } from "../ArcGISContext";
import { HubItemEntity } from "../core/HubItemEntity";

// import { DEFAULT_PAGE } from "./defaults";
import {
  // createPage,
  deletePage,
  //   ENTERPRISE_PAGE_ITEM_TYPE,
  fetchPage,
  //   HUB_PAGE_ITEM_TYPE,
  // updatePage,
} from "./HubPages";

/**
 * Hub Page Class
 * NOTE: This is a minimal implementation. Create operations are not supported at this time
 */
export class HubPage extends HubItemEntity<IHubPage> {
  // implements
  //   IWithStoreBehavior<IHubPage>,
  //   IWithPermissionBehavior,
  //   IWithSharingBehavior,
  /**
   * Private constructor so we don't have `new` all over the place. Allows for
   * more flexibility in how we create the HubPageManager over time.
   * @param context
   */
  private constructor(page: IHubPage, context: IArcGISContext) {
    super(page, context);
  }

  /**
   * Create an instance from an IHubPage object
   * @param json - JSON object to create a HubPage from
   * @param context - ArcGIS context
   * @returns
   */
  static fromJson(json: Partial<IHubPage>, context: IArcGISContext): HubPage {
    // merge what we have with the default values
    const pojo = this.applyDefaults(json, context);
    return new HubPage(pojo, context);
  }

  /**
   *
   * NOT IMPLEMENTED YET: Create a new HubPage, returning a HubPage instance.
   * By default, this does not save the page to the backing store.
   * @param partialPage
   * @param context
   * @returns
   */
  static async create(
    partialPage: Partial<IHubPage>,
    context: IArcGISContext,
    save: boolean = false
  ): Promise<HubPage> {
    const pojo = this.applyDefaults(partialPage, context);
    // return an instance of HubPage
    const instance = HubPage.fromJson(pojo, context);
    if (save) {
      await instance.save();
    }
    return instance;
  }

  /**
   * Fetch a Page from the backing store and return a HubPage instance.
   * @param identifier - Identifier of the page to load
   * @param context
   * @returns
   */
  static async fetch(
    identifier: string,
    context: IArcGISContext
  ): Promise<HubPage> {
    // fetch the page by id or slug
    try {
      const page = await fetchPage(identifier, context.hubRequestOptions);
      // create an instance of HubPage from the page
      return HubPage.fromJson(page, context);
    } catch (ex) {
      if (
        (ex as Error).message ===
        "CONT_0001: Item does not exist or is inaccessible."
      ) {
        throw new Error(`Page not found.`);
      } else {
        throw ex;
      }
    }
  }

  private static applyDefaults(
    partialPage: Partial<IHubPage>,
    context: IArcGISContext
  ): IHubPage {
    // ensure we have the orgUrlKey
    // if (!partialPage.orgUrlKey) {
    //   partialPage.orgUrlKey = context.portal.urlKey;
    // }
    // extend the partial over the defaults
    const pojo = { ...DEFAULT_PAGE, ...partialPage } as IHubPage;
    // pojo.type = context.isPortal
    //   ? ENTERPRISE_PAGE_ITEM_TYPE
    //   : HUB_PAGE_ITEM_TYPE;
    return pojo;
  }

  /**
   * Apply a new state to the instance
   * @param changes
   */
  update(changes: Partial<IHubPage>): void {
    if (this.isDestroyed) {
      throw new Error("HubPage is already destroyed.");
    }
    // merge partial onto existing entity
    this.entity = { ...this.entity, ...changes };
  }

  /**
   * Save the HubPage to the backing store.
   * Currently Pages are stored as Items in Portal
   * @returns
   */
  async save(): Promise<void> {
    if (this.isDestroyed) {
      throw new Error("HubPage is already destroyed.");
    }

    if (this.entity.id) {
      // update it
      this.entity = await updatePage(
        this.entity,
        this.context.hubRequestOptions
      );
    } else {
      // create it
      this.entity = await createPage(
        this.entity,
        this.context.hubRequestOptions
      );
    }
    // call the after save hook on superclass
    await super.afterSave();

    return;
  }

  /**
   * Delete the HubPage from the store
   * set a flag to indicate that it is destroyed
   * @returns
   */
  async delete(): Promise<void> {
    if (this.isDestroyed) {
      throw new Error("HubPage is already destroyed.");
    }
    this.isDestroyed = true;
    // Delegate to module fn
    await deletePage(this.entity.id, this.context.userRequestOptions);
  }
}
