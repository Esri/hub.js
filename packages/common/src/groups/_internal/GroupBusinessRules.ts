import { EntityCapabilities, ICapabilityPermission } from "../../capabilities";
import { itemPropsNotInTemplates } from "../../items";
import { IPermissionPolicy } from "../../permissions";

/**
 * Default capabilities for a Group.
 * If not listed here, the capability will not be available
 * @private
 */
export const GroupDefaultCapabilities: EntityCapabilities = {
  details: true,
  settings: true,
  members: true,
  content: true,
};

/**
 * List of all the Group Capability Permissions
 * These are considered Hub Business Rules and are not intended
 * to be modified by consumers
 * @private
 */
export const GroupCapabilityPermissions: ICapabilityPermission[] = [
  {
    entity: "group",
    capability: "details",
    permissions: ["hub:group:edit"],
  },
  {
    entity: "group",
    capability: "settings",
    permissions: ["hub:group:owner"],
  },
  {
    entity: "group",
    capability: "members",
    permissions: ["hub:group:view"],
  },
  {
    entity: "group",
    capability: "content",
    permissions: ["hub:group:edit"],
  },
];

/**
 * Group Permission Policies
 * These define the requirements any user must meet to perform related actions
 * @private
 */
export const GroupPermissions = [
  "hub:group:create",
  "hub:group:delete",
  "hub:group:edit",
  "hub:group:view",
  "hub:group:owner",
] as const;

/**
 * Group permission policies
 * @private
 */
export const GroupPermissionPolicies: IPermissionPolicy[] = [
  {
    permission: "hub:group:create",
    subsystems: ["groups"],
    authenticated: true,
    privileges: ["portal:user:createGroup"],
  },
  {
    permission: "hub:group:view",
    subsystems: ["groups"],
    authenticated: false,
  },
  {
    permission: "hub:group:edit",
    authenticated: true,
    subsystems: ["groups"],
    entityEdit: true,
  },
  {
    permission: "hub:group:delete",
    authenticated: true,
    subsystems: ["groups"],
    entityOwner: true,
  },
  {
    permission: "hub:group:owner",
    authenticated: true,
    subsystems: ["groups"],
    entityOwner: true,
  },
];
