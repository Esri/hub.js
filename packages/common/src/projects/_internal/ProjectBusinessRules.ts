import { EntityCapabilities, ICapabilityPermission } from "../../capabilities";
import { IEntityFeatures, IPermissionPolicy } from "../../permissions";

/**
 * Default capabilities for a Project. If not listed here, the capability will not be available
 * This hash is combined with the capabilities hash stored in the item data. Regardless of what
 * properties are defined in the item data, only the capabilities defined here will be available
 * @private
 * TODO: Remove capabilities
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
 * TODO: Remove capabilities
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
    permissions: ["hub:project:edit", "temp:workspace:released"],
  },
  {
    entity: "project",
    capability: "dashboard",
    permissions: ["hub:project:edit"],
  },
];

/**
 * Default features for a Project. These are the features that can be enabled / disabled by the entity owner
 */
export const ProjectDefaultFeatures: IEntityFeatures = {
  "hub:project:events": false,
  "hub:project:content": true,
  "hub:project:discussions": false,
};

/**
 * Project Permission Policies
 * These define the requirements any user must meet to perform related actions
 * @private
 */
export const ProjectPermissions = [
  "hub:project",
  "hub:project:create",
  "hub:project:delete",
  "hub:project:edit",
  "hub:project:view",
  "hub:project:owner",
  "hub:project:events",
  "hub:project:content",
  "hub:project:discussions",
] as const;

/**
 * Project permission policies
 * @private
 */
export const ProjectPermissionPolicies: IPermissionPolicy[] = [
  {
    permission: "hub:project",
    services: ["portal"],
    licenses: ["hub-premium"],
  },
  {
    permission: "hub:project:create",
    authenticated: true,
    dependencies: ["hub:project"],
    privileges: ["portal:user:createItem"],
  },
  {
    // Anyone can view a project
    permission: "hub:project:view",
    subsystems: ["platform"],
  },
  {
    permission: "hub:project:edit",
    dependencies: ["hub:project"],
    authenticated: true,
    entityEdit: true,
  },
  {
    permission: "hub:project:delete",
    dependencies: ["hub:project"],
    authenticated: true,
    entityOwner: true,
  },
  {
    permission: "hub:project:owner",
    dependencies: ["hub:project"],
    authenticated: true,
    entityOwner: true,
  },
  {
    permission: "hub:project:events",
    dependencies: ["hub:project:view"],
  },
  {
    permission: "hub:project:content",
    dependencies: ["hub:project:edit"],
  },
  {
    permission: "hub:project:discussions",
    dependencies: ["hub:project:view"],
  },
  {
    permission: "hub:project:workspace:overview",
    dependencies: ["hub:project:view"],
  },
  {
    permission: "hub:project:workspace:dashboard",
    dependencies: ["hub:project:view"],
    environments: ["devext", "qaext"],
  },
  {
    permission: "hub:project:workspace:details",
    dependencies: ["hub:project:edit"],
  },
  {
    permission: "hub:project:workspace:settings",
    dependencies: ["hub:project:edit"],
    entityOwner: true,
  },
  {
    permission: "hub:project:workspace:collaborators",
    dependencies: ["hub:project:edit"],
  },
  {
    permission: "hub:project:workspace:content",
    dependencies: ["hub:project:edit"],
  },
  {
    permission: "hub:project:workspace:metrics",
    dependencies: ["hub:project:edit"],
  },
];
