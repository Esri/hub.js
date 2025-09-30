import { HubLicense } from "./HubLicense";
import { HubService, HubServiceStatus } from "../../core/types/ISystemStatus";
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
   * Can the user delete the entity being accessed?
   */
  entityDelete?: boolean;

  /**
   * Must the user be the owner of the entity being accessed?
   */
  entityOwner?: boolean;

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

  /**
   * Policy will deny access on PROD,until after this date.
   * Format must be ISO Date Time format: YYYY-MM-DDTHH:mm:ss.sssZ
   * This is primarily used to prevent access to features that require coordination
   * with documentation/string translations, which have specific delivery dates.
   */
  releaseAfter?: string;

  /**
   * Policy will deny access on PROD, starting after this date.
   * Format must be ISO Date Time format: YYYY-MM-DDTHH:mm:ss.sssZ
   * This is primarily used to allow for deprecation of features, with a known retirement date.
   * This should be used sparingly, and only when there is a clear deprecation path for users.
   */
  retireAfter?: string;

  /**
   * Policy will deny access until portal.currentVersion matches or is greater than this value. e.g. `2025.3`
   * This is primarily used to prevent access to features that require coordination
   * with specific ArcGIS Online releases.
   * Do not use this for Enterprise version checks! Given that release cadence, we need
   * to ungate features based on the Enterprise release cycle, and not on specific versions.
   */
  platformVersion?: number;
}

export type FeatureFlag = "settings" | "details";

/**
 * Hash of permission:boolean, which is used in two contexts.
 * First, it is used to control access to "features" are enabled for a particular entity
 * e.g. By default, Events are enabled for Sites, but a specific Site may disable events
 * The second use of `IFeatureFlags` is in `ArcGISContext`, and it holds a hash of permissions
 * which have been enabled or disabled via uri parameters. Parsing of the uri parameters is
 * the responsibility of the host application. In this use, if the value is set to false, then
 * access is denied under all conditions. If the value is set to true, licensing,
 * privilege and services checks are run, and if those pass, access is granted.
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IFeatureFlags
  extends Partial<Record<Permission | FeatureFlag, boolean>> {}

/**
 * Hash of service status overrides parsed from query params. This is
 * used by the ContextManager to override the service status, to simulate
 * a service being down, or to test the behavior of the system when a service
 * is unavailable.
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IServiceFlags extends Record<HubService, HubServiceStatus> {}

/**
 * Hub Availability levels
 */
export type HubAvailability = "alpha" | "beta" | "general" | "flag";

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

  /** A condition dictates if an assertion should be evaluated. If any condition evaluates to false,
   * the assertion should be ignored. If the conditions evaluate to true, or if there are no conditions,
   * the assertion should be evaluated.
   */
  conditions?: IPolicyAssertion[];
}

/**
 * Assertion types which define the comparison operation to be performed
 */
export type AssertionType =
  | "eq"
  | "neq"
  | "gt"
  | "lt"
  | "length-gt"
  | "length-lt"
  | "contains"
  | "contains-all"
  | "contains-some"
  | "without"
  | "included-in"
  | "is-group-admin"
  | "is-not-group-admin"
  | "is-group-member"
  | "is-not-group-member"
  | "is-group-owner"
  | "is-not-group-owner"
  | "starts-with"
  | "ends-with"
  | "not-starts-with"
  | "not-ends-with";
