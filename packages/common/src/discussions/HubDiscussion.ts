import { DEFAULT_DISCUSSION } from "./defaults";
import { IWithSharingBehavior, IWithStoreBehavior } from "../core/behaviors";
import { IArcGISContext } from "../ArcGISContext";
import { IHubDiscussion } from "../core/types";
import { HubItemEntity } from "../core/HubItemEntity";
import { fetchDiscussion } from "./fetch";

/**
 * Hub Discussion Class
 */

export class HubDiscussion
  extends HubItemEntity<IHubDiscussion>
  implements IWithStoreBehavior<IHubDiscussion>, IWithSharingBehavior
{
  /**
   * Create an instance from an IHubDiscussion object
   * @param json JSON object to create a HubDiscussion from
   * @param context ArcGIS context
   * @returns a HubDiscussion
   */
  static fromJson(
    json: Partial<IHubDiscussion>,
    context: IArcGISContext
  ): HubDiscussion {
    // merge what we have with the default values
    const pojo = this.applyDefaults(json, context);
    return new HubDiscussion(pojo, context);
  }

  /**
   * Create a new HubDiscussion, returning a HubDiscussion instance.
   * Note: This does not persist the Discussion into the backing store
   * @param partialDiscussion a partial IHubDiscussion
   * @param context ArcGIS context
   * @returns promise that resolves a HubDiscussion
   */
  static async create(
    partialDiscussion: Partial<IHubDiscussion>,
    context: IArcGISContext,
    save: boolean = false
  ): Promise<HubDiscussion> {
    const pojo = this.applyDefaults(partialDiscussion, context);
    // return an instance of HubDiscussion
    const instance = HubDiscussion.fromJson(pojo, context);
    if (save) {
      await instance.save();
    }
    return instance;
  }

  /**
   * Fetch a Discussion from the backing store and return a HubDiscussion instance.
   * @param identifier slug or item id
   * @param context ArcGIS context
   * @returns promise that resolves a HubDiscussion
   */
  static async fetch(
    identifier: string,
    context: IArcGISContext
  ): Promise<HubDiscussion> {
    try {
      const entity = await fetchDiscussion(identifier, context.requestOptions);
      // create an instance of HubDiscussion from the entity
      return HubDiscussion.fromJson(entity, context);
    } catch (ex) {
      throw (ex as Error).message ===
        "CONT_0001: Item does not exist or is inaccessible."
        ? new Error("Discussion not found.")
        : ex;
    }
  }

  private static applyDefaults(
    partialDiscussion: Partial<IHubDiscussion>,
    context: IArcGISContext
  ): IHubDiscussion {
    // ensure we have the orgUrlKey
    if (!partialDiscussion.orgUrlKey) {
      partialDiscussion.orgUrlKey = context.portal.urlKey;
    }
    // extend the partial over the defaults
    const pojo = {
      ...DEFAULT_DISCUSSION,
      ...partialDiscussion,
    } as IHubDiscussion;
    return pojo;
  }

  /**
   * Apply a new state to the instance
   * @param changes A partial IHubDiscussion
   */
  update(changes: Partial<IHubDiscussion>): void {
    if (this.isDestroyed) {
      throw new Error("HubDiscussion is already destroyed.");
    }
    // merge partial onto existing entity
    this.entity = { ...this.entity, ...changes };
  }

  async save(): Promise<void> {
    if (this.isDestroyed) {
      throw new Error("HubDiscussion is already destroyed.");
    }

    const { createDiscussion, updateDiscussion } = await import("./edit");

    if (this.entity.id) {
      // update it
      this.entity = await updateDiscussion(
        this.entity,
        this.context.userRequestOptions
      );
    } else {
      // create it
      this.entity = await createDiscussion(
        this.entity,
        this.context.userRequestOptions
      );
    }

    // call the after save hook on superclass
    await super.afterSave();

    return;
  }

  /**
   * Delete the HubDiscussion from the store
   * set a flag to indicate that it is destroyed
   * @returns a promise
   */
  async delete(): Promise<void> {
    if (this.isDestroyed) {
      throw new Error("HubDiscussion is already destroyed.");
    }
    const { deleteDiscussion } = await import("./edit");
    this.isDestroyed = true;
    // Delegate to module fn
    await deleteDiscussion(this.entity.id, this.context.userRequestOptions);
  }
}
