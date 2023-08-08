import { HubLicense } from "./HubLicense";
import { HubSubsystem } from "../../core/types/ISystemStatus";
import { Permission } from "./Permission";
import { PlatformPrivilege } from "./PlatformPrivilege";
import { IEntityPermissionPolicy } from "./IEntityPermissionPolicy";

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
  authenticated?: boolean;
  /**
   * What licenses are required for this permission to be granted.
   * This is checking the licese of the current user's org. It is not transitive to the entity being accessed.
   * e.g. If a user is in a Partner "hub-basic" org, they can not create "premium" entities (e.g. Projects)
   */
  licenses?: HubLicense[];
  /**
   * Any platform level privileges required for this permission to be granted
   * e.g. "portal:user:createItem"
   */
  privileges?: PlatformPrivilege[];

  /**
   * Is the user an owner of the entity being accessed?
   */
  entityEdit?: boolean;

  /**
   * Must the user be the owner of the entity being accessed?
   */
  entityOwner?: boolean;

  /**
   * Is this gated to alpha orgs?
   */
  alpha?: boolean;
  /**
   * More complex policies can be defined with a set of assertions
   */
  assertions?: IPolicyAssertion[];
}

export interface IPolicyAssertion {
  property: string;
  type: AssertionType;
  value: any;
}

export type AssertionType =
  | "eq"
  | "neq"
  | "gt"
  | "lt"
  | "contains"
  | "contains-all"
  | "without"
  | "included-in"
  | "is-group-admin"
  | "is-group-member"
  | "is-group-owner"
  | "starts-with"
  | "ends-with"
  | "not-starts-with"
  | "not-ends-with";
