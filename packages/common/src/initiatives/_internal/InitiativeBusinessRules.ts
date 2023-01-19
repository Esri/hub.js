import { EntityCapabilities, ICapabilityPermission } from "../../capabilities";
import { IPermissionPolicy } from "../../permissions";

/**
 * Default capabilities for a Initiative. If not listed here, the capability will not be available
 * This hash is combined with the capabilities hash stored in the item data. Regardless of what
 * properties are defined in the item data, only the capabilities defined here will be available
 * @private
 */
export const InitiativeDefaultCapabilities: EntityCapabilities = {
  overview: true,
  details: true,
  settings: true,
};

/**
 * List of all the Initiative Capability Permissions
 * These are considered Hub Business Rules and are not intended
 * to be modified by consumers
 * @private
 */
export const InitiativeCapabilityPermissions: ICapabilityPermission[] = [
  {
    entity: "initiative",
    capability: "overview",
    permissions: ["hub:initiative:view"],
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
];

/**
 * Initiative Permission Policies
 * These define the requirements any user must meet to perform related actions
 * @private
 */
export const InitiativePermissions = [
  "hub:initiative:create",
  "hub:initiative:delete",
  "hub:initiative:edit",
  "hub:initiative:view",
] as const;

/**
 * Initiative permission policies
 * @private
 */
export const InitiativePermissionPolicies: IPermissionPolicy[] = [
  {
    permission: "hub:initiative:create",
    subsystems: ["projects"],
    authenticated: true,
    privileges: ["portal:user:createItem"],
    licenses: ["hub-premium"],
  },
  {
    permission: "hub:initiative:view",
    subsystems: ["projects"],
    authenticated: false,
    licenses: ["hub-premium"],
  },
  {
    permission: "hub:initiative:edit",
    authenticated: true,
    subsystems: ["projects"],
    entityEdit: true,
    licenses: ["hub-premium"],
  },
  {
    permission: "hub:initiative:delete",
    authenticated: true,
    subsystems: ["projects"],
    entityOwner: true,
    licenses: ["hub-premium"],
  },
];
