import { EntityCapabilities, ICapabilityPermission } from "../../capabilities";
import { IPermissionPolicy } from "../../permissions";

/**
 * Default capabilities for a Discussion. If not listed here, the capability will not be available
 * This hash is combined with the capabilities hash stored in the item data. Regardless of what
 * properties are defined in the item data, only the capabilities defined here will be available
 * @private
 * TODO: Remove capabilities
 */
export const DiscussionDefaultCapabilities: EntityCapabilities = {
  overview: true,
  details: true,
  settings: true,
  dashboard: true,
};

/**
 * List of all the Discussion Capability Permissions
 * These are considered Hub Business Rules and are not intended
 * to be modified by consumers
 * TODO: Remove capabilities
 * @private
 */
export const DiscussionCapabilityPermissions: ICapabilityPermission[] = [
  {
    entity: "discussion",
    capability: "overview",
    permissions: ["hub:discussion:view"],
  },
  {
    entity: "discussion",
    capability: "dashboard",
    permissions: ["hub:discussion:edit"],
  },
  {
    entity: "discussion",
    capability: "details",
    permissions: ["hub:discussion:edit"],
  },
  {
    entity: "discussion",
    capability: "settings",
    permissions: ["hub:discussion:edit"],
  },
];

/**
 * Discussion Permission Policies
 * These define the requirements any user must meet to perform related actions
 * @private
 */
export const DiscussionPermissions = [
  "hub:discussion",
  "hub:discussion:create",
  "hub:discussion:delete",
  "hub:discussion:edit",
  "hub:discussion:view",
  "hub:discussion:workspace:overview",
  "hub:discussion:workspace:dashboard",
  "hub:discussion:workspace:details",
  "hub:discussion:workspace:settings",
  "hub:discussion:workspace:collaborators",
  "hub:discussion:workspace:discussion",
  "hub:discussion:workspace:metrics",
] as const;

/**
 * Discussion permission policies
 * @private
 */
export const DiscussionPermissionPolicies: IPermissionPolicy[] = [
  {
    permission: "hub:discussion",
    services: ["discussions"],
  },
  {
    permission: "hub:discussion:create",
    dependencies: ["hub:discussion"],
    authenticated: true,
    privileges: ["portal:user:createItem"],
    licenses: ["hub-premium"],
  },
  {
    permission: "hub:discussion:view",
    dependencies: ["hub:discussion"],
    authenticated: false,
    licenses: ["hub-premium"],
  },
  {
    permission: "hub:discussion:edit",
    authenticated: true,
    dependencies: ["hub:discussion"],
    entityEdit: true,
    licenses: ["hub-premium"],
  },
  {
    permission: "hub:discussion:delete",
    authenticated: true,
    dependencies: ["hub:discussion"],
    entityOwner: true,
    licenses: ["hub-premium"],
  },
  {
    permission: "hub:discussion:workspace:overview",
    dependencies: ["hub:discussion:view"],
  },
  {
    permission: "hub:discussion:workspace:dashboard",
    dependencies: ["hub:discussion:view"],
    environments: ["devext", "qaext"],
  },
  {
    permission: "hub:discussion:workspace:details",
    dependencies: ["hub:discussion:edit"],
  },
  {
    permission: "hub:discussion:workspace:settings",
    dependencies: ["hub:discussion:edit"],
    entityOwner: true,
  },
  {
    permission: "hub:discussion:workspace:collaborators",
    dependencies: ["hub:discussion:edit"],
  },
  {
    permission: "hub:discussion:workspace:discussion",
    dependencies: ["hub:discussion:edit"],
  },
  {
    permission: "hub:discussion:workspace:metrics",
    dependencies: ["hub:discussion:edit"],
  },
];
