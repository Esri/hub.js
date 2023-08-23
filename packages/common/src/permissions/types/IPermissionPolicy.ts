import { HubLicense } from "./HubLicense";
import { HubService } from "../../core/types/ISystemStatus";
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
   * Parent permissions this permission is dependent on
   */
  dependencies?: Permission[];

  /**
   * What services are required to be online for this permission to be granted
   */
  services?: HubService[];

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
   * Is this permission gated to a specific availability?
   * This is used to limit access to features that are not yet available in production
   */
  availability?: HubAvailability[];

  /**
   * Is this permission gated to a specific environment? (e.g. devext, qaext)
   * This is used to limit access to features that are not yet available in production
   */
  environments?: HubEnvironment[];

  /**
   * Any platform level privileges required for this permission to be granted
   * e.g. "portal:user:createItem"
   */
  privileges?: PlatformPrivilege[];

  /**
   * Can an entity provide additional conditions to further limit access?
   */
  entityConfigurable?: boolean;

  /**
   * Is the user an owner of the entity being accessed?
   */
  entityEdit?: boolean;

  /**
   * Must the user be the owner of the entity being accessed?
   */
  entityOwner?: boolean;

  /**
   * DEPRECATED: Use `gatedAvailability: "alpha"` instead
   */
  alpha?: boolean;
  /**
   * More complex policies can be defined with a set of assertions
   */
  assertions?: IPolicyAssertion[];

  /**
   * Value set by the feature flagging system to override the default permission behavior. This can be used to
   * demo features to specific users or groups, during a specific user session.
   * If `true`, the permission will be granted as long as the license and privilege requirements are met.
   * If `false`, the permission will be denied for all users - typically as a means to check for graceful degradation
   * if a system is offline.
   */
  flagValue?: boolean;
}

/**
 * Hash of features for an entity which can be used to determine if a feature is enabled for the entity
 * This can be applied to any permissin, enabling a lot of flexibility in how features are described and enabled
 * If the value is set to false, then the permission will alway be set to false for all users.
 */
export interface IEntityFeatures extends Record<Permission, boolean> {}

/**
 * Hub Availability levels
 */
export type HubAvailability = "alpha" | "beta" | "general";

/**
 * Hub Run-time environments
 */
export type HubEnvironment =
  | "devext"
  | "qaext"
  | "production"
  | "enterprise"
  | "enterprise-k8s";

/**
 * Assertion used to define more complex permission policies
 */
export interface IPolicyAssertion {
  property: string;
  type: AssertionType;
  value: any;
}

/**
 * Assertion types which define the comparison operation to be performed
 */
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
