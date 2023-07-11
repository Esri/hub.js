import {
  IArcGISContext,
  IWithStoreBehavior,
  cloneObject,
  createHubGroup,
  updateHubGroup,
  fetchHubGroup,
  deleteHubGroup,
} from "..";
import { IHubGroup } from "../core/types/IHubGroup";
import { DEFAULT_GROUP } from "./defaults";

export class HubGroup implements IWithStoreBehavior<IHubGroup> {
  protected context: IArcGISContext;
  protected entity: IHubGroup;
  protected isDestroyed = false;

  private constructor(group: IHubGroup, context: IArcGISContext) {
    this.entity = group;
    this.context = context;
  }

  static fromJson(json: Partial<IHubGroup>, context: IArcGISContext): HubGroup {
    // merge what we have with the default values
    const pojo = this.applyDefaults(json);
    return new HubGroup(pojo, context);
  }

  /**
   * Create a new HubGroup, returning a HubGroup instance.
   * Note: This does not persist the Group into the backing store
   * @param partialGroup
   * @param context
   * @returns
   */
  static async create(
    partialGroup: Partial<IHubGroup>,
    context: IArcGISContext,
    save: boolean = false
  ): Promise<HubGroup> {
    const pojo = this.applyDefaults(partialGroup);
    // return an instance of HubGroup
    const instance = HubGroup.fromJson(pojo, context);
    if (save) {
      await instance.save();
    }
    return instance;
  }

  /**
   * Fetch a Group from the backing store and return a HubGroup instance.
   * @param identifier - Identifier of the group to load
   * @param context
   * @returns
   */
  static async fetch(
    identifier: string,
    context: IArcGISContext
  ): Promise<HubGroup> {
    try {
      const group = await fetchHubGroup(identifier, context.userRequestOptions);
      // create an instance of HubGroup from the group
      return HubGroup.fromJson(group, context);
    } catch (ex) {
      if (
        (ex as Error).message ===
        "COM_0003: Group does not exist or is inaccessible."
      ) {
        throw new Error(`Group not found.`);
      } else {
        throw ex;
      }
    }
  }

  private static applyDefaults(partialGroup: Partial<IHubGroup>): IHubGroup {
    // extend the partial over the defaults
    const pojo = { ...DEFAULT_GROUP, ...partialGroup } as IHubGroup;
    return pojo;
  }

  get canEdit(): boolean {
    const memberType = this.entity.userMembership?.memberType;
    const userName = this.entity.userMembership?.username;
    return (
      userName === this.context.currentUser.username &&
      (memberType === "owner" || memberType === "admin")
    );
  }

  get canDelete(): boolean {
    const memberType = this.entity.userMembership?.memberType;
    const userName = this.entity.userMembership?.username;
    return (
      userName === this.context.currentUser.username &&
      (memberType === "owner" || memberType === "admin")
    );
  }

  toJson(): IHubGroup {
    return cloneObject(this.entity);
  }

  /**
   * Apply a new state to the instance
   * @param changes
   */
  update(changes: Partial<IHubGroup>): void {
    // where is this defined??
    if (this.isDestroyed) {
      throw new Error("HubGroup is already destroyed.");
    }
    // merge partial onto existing entity
    this.entity = { ...this.entity, ...changes };
  }

  /**
   * Save the HubGroup to the backing store. Currently Groups are stored as Items in Portal
   * @returns
   */
  async save(): Promise<void> {
    if (this.isDestroyed) {
      throw new Error("HubGroup is already destroyed.");
    }
    if (this.entity.id) {
      // update it
      this.entity = await updateHubGroup(
        this.entity,
        this.context.userRequestOptions
      );
    } else {
      // create it
      this.entity = await createHubGroup(
        this.entity,
        this.context.userRequestOptions
      );
    }
    return;
  }

  /**
   * Delete the HubGroup from the store
   * set a flag to indicate that it is destroyed
   * @returns
   */
  async delete(): Promise<void> {
    if (this.isDestroyed) {
      throw new Error("HubGroup is already destroyed.");
    }
    this.isDestroyed = true;
    // Delegate to module fn
    await deleteHubGroup(this.entity.id, this.context.userRequestOptions);
  }
}
