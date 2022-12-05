import { HubLicense } from "./HubLicense";
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
   * Is this gated to alpha orgs?
   */
  alpha?: boolean;
  /**
   *
   */
  assertions?: IPolicyAssertion[];
}

export interface IPolicyAssertion {
  property: string;
  assertion:
    | "eq"
    | "neq"
    | "gt"
    | "lt"
    | "contains"
    | "contains-all"
    | "not-contains"
    | "included-in";
  value: any;
}

const userInGroup: IPolicyAssertion = {
  property: "mapBy:id:context.currentUser.groups",
  assertion: "contains",
  value: "entity.group.id",
};

const mostlyComplete: IPolicyAssertion = {
  property: "item.properties.percentComplete",
  assertion: "gt",
  value: 75,
};

const before2020: IPolicyAssertion = {
  property: "item.modified",
  assertion: "lt",
  value: 1577836800000,
};

const itemCreatedAfterGroup: IPolicyAssertion = {
  property: "item.created",
  assertion: "gt",
  value: "group.created",
};

const permsission = {
  permission: "discussions:channel:createprivate",
  subsystems: ["discussions"],
  assertions: [
    {
      property: "context.isAuthenticated",
      assertion: "eq",
      value: true,
    },
    {
      property: "typeKeywords",
      assertion: "not-contains",
      value: "cannotDiscuss",
    },
    {
      property: "context.license",
      assertion: "included-in",
      value: ["hub-basic", "hub-premium"],
    },
    {
      property: "mapBy:id:context.currentUser.groups",
      assertion: "contains",
      value: "entity.group.id",
    },
    {
      property: "item.created",
      assertion: "lt",
      value: "group.created",
    },
    {
      property: "modified",
      assertion: "gt",
      value: 1577836800000,
    },
  ],
};
