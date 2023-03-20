import { EntityCapabilities, ICapabilityPermission } from "../../capabilities";
import { IPermissionPolicy } from "../../permissions";

/**
 * Default capabilities for a Discussion. If not listed here, the capability will not be available
 * This hash is combined with the capabilities hash stored in the item data. Regardless of what
 * properties are defined in the item data, only the capabilities defined here will be available
 * @private
 */
export const DiscussionDefaultCapabilities: EntityCapabilities = {
  overview: true,
  details: true,
  settings: true,
};

/**
 * List of all the Discussion Capability Permissions
 * These are considered Hub Business Rules and are not intended
 * to be modified by consumers
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
  "hub:discussion:create",
  "hub:discussion:delete",
  "hub:discussion:edit",
  "hub:discussion:view",
] as const;

/**
 * Discussion permission policies
 * @private
 */
export const DiscussionPermissionPolicies: IPermissionPolicy[] = [
  {
    permission: "hub:discussion:create",
    subsystems: ["discussions"],
    authenticated: true,
    privileges: ["portal:user:createItem"],
    licenses: ["hub-premium"],
  },
  {
    permission: "hub:discussion:view",
    subsystems: ["discussions"],
    authenticated: false,
    licenses: ["hub-premium"],
  },
  {
    permission: "hub:discussion:edit",
    authenticated: true,
    subsystems: ["discussions"],
    entityEdit: true,
    licenses: ["hub-premium"],
  },
  {
    permission: "hub:discussion:delete",
    authenticated: true,
    subsystems: ["discussions"],
    entityOwner: true,
    licenses: ["hub-premium"],
  },
];
