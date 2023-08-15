import { EntityCapabilities, ICapabilityPermission } from "../../capabilities";
import { IEntityFeatures, IPermissionPolicy } from "../../permissions";

/**
 * Default capabilities for a Initiative. If not listed here, the capability will not be available
 * This hash is combined with the capabilities hash stored in the item data. Regardless of what
 * properties are defined in the item data, only the capabilities defined here will be available
 * @private
 */
// TODO: Remove capabilities
export const InitiativeDefaultCapabilities: EntityCapabilities = {
  overview: true,
  details: true,
  settings: true,
  content: true,
  dashboard: true,
};

/**
 * List of all the Initiative Capability Permissions
 * These are considered Hub Business Rules and are not intended
 * to be modified by consumers
 * @private
 */
// TODO: Remove capabilities
export const InitiativeCapabilityPermissions: ICapabilityPermission[] = [
  {
    entity: "initiative",
    capability: "overview",
    permissions: ["hub:initiative:view"],
  },
  {
    entity: "initiative",
    capability: "dashboard",
    permissions: ["hub:initiative:edit"],
  },
  {
    entity: "initiative",
    capability: "details",
    permissions: ["hub:initiative:edit"],
  },
  {
    entity: "initiative",
    capability: "settings",
    permissions: ["hub:initiative:edit"],
  },
  {
    entity: "initiative",
    capability: "content",
    permissions: ["hub:initiative:edit"],
  },
];

/**
 * Default features for a Initiative. These are the features that can be enabled / disabled by the entity owner
 */
export const InitiativeDefaultFeatures: IEntityFeatures = {
  "hub:initiative:events": false,
  "hub:initiative:content": true,
  "hub:initiative:discussions": false,
};

/**
 * Initiative Permission Policies
 * These define the requirements any user must meet to perform related actions
 * @private
 */
export const InitiativePermissions = [
  "hub:initiative",
  "hub:initiative:create",
  "hub:initiative:delete",
  "hub:initiative:edit",
  "hub:initiative:view",
  "hub:initiative:events",
  "hub:initiative:content",
  "hub:initiative:discussions",
] as const;

/**
 * Initiative permission policies
 * @private
 */
export const InitiativePermissionPolicies: IPermissionPolicy[] = [
  {
    permission: "hub:initiative",
    services: ["portal"],
    licenses: ["hub-premium"],
  },
  {
    permission: "hub:initiative:create",
    dependencies: ["hub:initiative"],
    authenticated: true,
    privileges: ["portal:user:createItem"],
  },
  {
    permission: "hub:initiative:view",
    services: ["portal"],
    authenticated: false,
    licenses: ["hub-premium", "hub-basic"],
  },
  {
    permission: "hub:initiative:edit",
    dependencies: ["hub:initiative"],
    authenticated: true,
    entityEdit: true,
  },
  {
    permission: "hub:initiative:delete",
    dependencies: ["hub:initiative"],
    authenticated: true,

    entityOwner: true,
  },
  {
    permission: "hub:initiative:events",
    dependencies: ["hub:initiative:view"],
  },
  {
    permission: "hub:initiative:content",
    dependencies: ["hub:initiative:edit"],
  },
  {
    permission: "hub:initiative:discussions",
    dependencies: ["hub:initiative:view"],
  },
];
