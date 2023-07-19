import {
  createHubGroup,
  updateHubGroup,
  fetchHubGroup,
  deleteHubGroup,
} from "./HubGroups";
import { IHubGroup } from "../core/types/IHubGroup";
import { DEFAULT_GROUP } from "./defaults";
import {
  IEntityPermissionPolicy,
  IPermissionAccessResponse,
  Permission,
  addPermissionPolicy,
  checkPermission,
  removePermissionPolicy,
} from "../permissions";
import { IWithStoreBehavior } from "../core/behaviors/IWithStoreBehavior";
import { IWithPermissionBehavior } from "../core/behaviors/IWithPermissionBehavior";
import { IArcGISContext } from "../ArcGISContext";
import { cloneObject } from "../util";

/**
 * Hub Group Class
 */
export class HubGroup
  implements IWithStoreBehavior<IHubGroup>, IWithPermissionBehavior
{
  protected context: IArcGISContext;
  protected entity: IHubGroup;
  protected isDestroyed = false;

  private constructor(group: IHubGroup, context: IArcGISContext) {
    this.entity = group;
    this.context = context;
  }

  /**
   * Whether the user can edit the group, only the managers can
   */
  get canEdit(): boolean {
    const memberType = this.entity.userMembership?.memberType;
    const userName = this.entity.userMembership?.username;
    return (
      userName === this.context.currentUser.username &&
      (memberType === "owner" || memberType === "admin")
    );
  }

  /**
   * Whether the user can delete the group, only the managers can
   */
  get canDelete(): boolean {
    const memberType = this.entity.userMembership?.memberType;
    const userName = this.entity.userMembership?.username;
    return (
      userName === this.context.currentUser.username &&
      (memberType === "owner" || memberType === "admin")
    );
  }

  /**
   * Whether the group is protected, if so, it can't be deleted
   */
  get isProtected(): boolean {
    return this.entity.protected;
  }

  /**
   * Create an instance from an IHubGroup object
   * @param json - JSON object to create a HubGroup from
   * @param context - ArcGIS context
   * @returns
   */
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
    return { ...DEFAULT_GROUP, ...partialGroup } as IHubGroup;
  }

  /**
   * Return the backing entity as an object literal
   */
  toJson(): IHubGroup {
    if (this.isDestroyed) {
      throw new Error("HubGroup is already destroyed.");
    }
    return cloneObject(this.entity);
  }

  /**
   * Apply a new state to the instance
   * @param changes
   */
  update(changes: Partial<IHubGroup>): void {
    if (this.isDestroyed) {
      throw new Error("HubGroup is already destroyed.");
    }
    // merge partial onto existing entity
    this.entity = { ...this.entity, ...changes };
  }

  /**
   * Save the HubGroup to the backing store
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

  /**
   * Check if current user has a specific permission, accounting for
   * both system and entity level policies
   * @param permission
   * @returns
   */
  checkPermission(permission: Permission): IPermissionAccessResponse {
    return checkPermission(permission, this.context, this.entity);
  }

  /**
   * Get all policies related to a specific permission
   * @param permission
   * @returns
   */
  getPermissionPolicies(permission: Permission): IEntityPermissionPolicy[] {
    const permissions = this.entity.permissions || [];
    return permissions.filter((p) => p.permission === permission);
  }

  /**
   * Add a policy to the entity
   * @param policy
   */
  addPermissionPolicy(policy: IEntityPermissionPolicy): void {
    this.entity.permissions = addPermissionPolicy(
      this.entity.permissions,
      policy
    );
  }

  /**
   * Remove a policy from the entity
   * @param permission
   * @param id
   */
  removePermissionPolicy(permission: Permission, id: string): void {
    this.entity.permissions = removePermissionPolicy(
      this.entity.permissions,
      permission,
      id
    );
  }

  /**
   * Check if the current user can access a specific capability
   * NOTE: We do not use the group capabilities right now as we do not
   * have a data store for it yet, leaving them here for the future
   * @param capability
   */
  // checkCapability(capability: Capability): ICapabilityAccessResponse {
  //   return checkCapability(capability, this.context, this.entity);
  // }
}
