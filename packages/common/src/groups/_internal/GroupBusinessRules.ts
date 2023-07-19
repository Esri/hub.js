import { EntityCapabilities, ICapabilityPermission } from "../../capabilities";
import { IPermissionPolicy } from "../../permissions";

/**
 * Default capabilities for a Group. If not listed here, the capability will not be available
 * NOTE: We do not use the group capabilities right now as we do not
 * have a data store for it yet, leaving them here for the future
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
    privileges: ["portal:user:createItem"],
    licenses: ["hub-premium"],
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
    licenses: ["hub-premium"],
  },
  {
    permission: "hub:group:owner",
    authenticated: true,
    subsystems: ["groups"],
    entityOwner: true,
    licenses: ["hub-premium"],
  },
];
