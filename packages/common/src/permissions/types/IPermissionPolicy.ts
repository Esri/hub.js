import { HubLicense } from "../../core/licensing";
import { HubSubsystem } from "../../core/types/ISystemStatus";
import { Permission } from "./Permission";
import { PlatformPrivilege } from "./PlatformPrivilege";

/**
 * Defines a system level policy for a specific permission.
 * All conditions must be met for the permission to be granted. Additinonal conditions may be added by an entity to further
 * limit access when the permission is checed in the contex to the entity.
 * e.g. "hub:project:create" in the context of an Initiative, may further restrict to members of a specfic group
 */

export interface IPermissionPolicy {
  /**
   * Permission being defined
   */
  permission: Permission;
  /**
   * What subsystems are required to be online for this permission to be granted
   */
  subsystems: HubSubsystem[];
  /**
   * Must the user authenticated?
   */
  authenticated: boolean;
  /**
   * What licenses are required for this permission to be granted.
   * This is checking the licese of the current user's org. It is not transitive to the entity being accessed.
   * e.g. If a user is in a Partner "hub-basic" org, they can not create "premium" entities (e.g. Projects)
   */
  licenses: HubLicense[];
  /**
   * Any platform level privileges required for this permission to be granted
   * e.g. "portal:user:createItem"
   */
  privileges?: PlatformPrivilege[];
  /**
   * Does the user need to be in a specific platform role to be granted this permission?
   * This is likely extremely rare.
   */
  roles?: string[];
  /**
   * Does the user require edit access to the entity to be granted this permission?
   */
  entityEdit?: boolean;
  /**
   * Does the user need to be the owner of the entity to be granted this permission?
   */
  entityOwner?: boolean;
}
