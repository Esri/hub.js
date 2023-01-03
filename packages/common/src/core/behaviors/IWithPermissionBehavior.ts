import {
  IPermissionAccessResponse,
  IEntityPermissionPolicy,
  Permission,
} from "../../permissions";
import {
  Capability,
  ICapabilityAccessResponse,
  IWorkspaceCapabilityResponse,
} from "../../capabilities";

/**
 * Composable behavior that adds permissions to an entity
 */
export interface IWithPermissionBehavior {
  /**
   * Determine if the current user has a specific permission
   * taking into account any entity specific policies
   * @param permission
   */
  checkPermission(permission: Permission): IPermissionAccessResponse;
  /**
   * Get all policies for a specific permission
   * @param permission
   */
  getPermissionPolicies(permission: Permission): IEntityPermissionPolicy[];
  /**
   * Add a permission policy to the entity
   * @param policy
   */
  addPermissionPolicy(policy: IEntityPermissionPolicy): void;
  /**
   * Remove a permission policy from the entity
   * @param permission
   * @param id
   */
  removePermissionPolicy(permission: Permission, id: string): void;
}

/**
 * Composable behavior that adds Capabilities to an entity
 */
export interface IWithCapabilityBehavior {
  /**
   * Is a specific capability available and enabled for the this entity?
   * @param capability
   */
  checkCapability(capability: Capability): ICapabilityAccessResponse;
}
