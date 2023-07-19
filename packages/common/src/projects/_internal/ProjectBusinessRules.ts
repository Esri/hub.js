import { EntityCapabilities, ICapabilityPermission } from "../../capabilities";
import { IPermissionPolicy } from "../../permissions";

/**
 * Default capabilities for a Project. If not listed here, the capability will not be available
 * This hash is combined with the capabilities hash stored in the item data. Regardless of what
 * properties are defined in the item data, only the capabilities defined here will be available
 * @private
 */
export const ProjectDefaultCapabilities: EntityCapabilities = {
  overview: true,
  details: true,
  settings: true,
  metrics: true,
  content: true,
  dashboard: true,
};

/**
 * List of all the Project Capability Permissions
 * These are considered Hub Business Rules and are not intended
 * to be modified by consumers
 * @private
 */
export const ProjectCapabilityPermissions: ICapabilityPermission[] = [
  {
    entity: "project",
    capability: "overview",
    permissions: ["hub:project:view"],
  },
  {
    entity: "project",
    capability: "details",
    permissions: ["hub:project:edit"],
  },
  {
    entity: "project",
    capability: "settings",
    permissions: ["hub:project:owner"],
  },
  {
    entity: "project",
    capability: "metrics",
    permissions: ["hub:project:edit"],
  },
  {
    entity: "project",
    capability: "content",
    permissions: ["hub:project:edit"],
  },
  {
    entity: "project",
    capability: "dashboard",
    permissions: ["hub:project:edit"],
  },
];

/**
 * Project Permission Policies
 * These define the requirements any user must meet to perform related actions
 * @private
 */
export const ProjectPermissions = [
  "hub:project:create",
  "hub:project:delete",
  "hub:project:edit",
  "hub:project:view",
  "hub:project:owner",
] as const;

/**
 * Project permission policies
 * @private
 */
export const ProjectPermissionPolicies: IPermissionPolicy[] = [
  {
    permission: "hub:project:create",
    subsystems: ["projects"],
    authenticated: true,
    privileges: ["portal:user:createItem"],
    licenses: ["hub-premium"],
  },
  {
    permission: "hub:project:view",
    subsystems: ["projects"],
    authenticated: false,
  },
  {
    permission: "hub:project:edit",
    authenticated: true,
    subsystems: ["projects"],
    entityEdit: true,
  },
  {
    permission: "hub:project:delete",
    authenticated: true,
    subsystems: ["projects"],
    entityOwner: true,
    licenses: ["hub-premium"],
  },
  {
    permission: "hub:project:owner",
    authenticated: true,
    subsystems: ["projects"],
    entityOwner: true,
    licenses: ["hub-premium"],
  },
];
