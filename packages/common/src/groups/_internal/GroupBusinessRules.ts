import { EntityCapabilities, ICapabilityPermission } from "../../capabilities";
import { IPermissionPolicy } from "../../permissions";

/**
 * Default capabilities for a Group.
 * If not listed here, the capability will not be available
 * TODO: Remove capabilities
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
 * TODO: Remove capabilities
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
  "hub:group",
  "hub:group:create",
  "hub:group:delete",
  "hub:group:edit",
  "hub:group:view",
  "hub:group:owner",
  "hub:group:workspace:overview",
  "hub:group:workspace:dashboard",
  "hub:group:workspace:details",
  "hub:group:workspace:settings",
  "hub:group:workspace:collaborators",
  "hub:group:workspace:content",
  "hub:group:workspace:members",
] as const;

/**
 * Group permission policies
 * @private
 */
export const GroupPermissionPolicies: IPermissionPolicy[] = [
  {
    permission: "hub:group",
    services: ["portal"],
  },
  {
    permission: "hub:group:create",
    dependencies: ["hub:group"],
    authenticated: true,
    privileges: ["portal:user:createGroup"],
  },
  {
    permission: "hub:group:view",
    dependencies: ["hub:group"],
  },
  {
    permission: "hub:group:edit",
    dependencies: ["hub:group"],
    authenticated: true,
    entityEdit: true,
  },
  {
    permission: "hub:group:delete",
    dependencies: ["hub:group"],
    authenticated: true,
    entityOwner: true,
  },
  {
    permission: "hub:group:owner",
    dependencies: ["hub:group"],
    authenticated: true,
    entityOwner: true,
  },
  {
    permission: "hub:group:workspace:details",
    dependencies: ["hub:group:edit"],
  },
  {
    permission: "hub:group:workspace:settings",
    dependencies: ["hub:group:edit"],
    entityOwner: true,
  },
  {
    permission: "hub:group:workspace:content",
    dependencies: ["hub:group:view"],
  },
  {
    permission: "hub:group:workspace:members",
    dependencies: ["hub:group:view"],
  },
];
