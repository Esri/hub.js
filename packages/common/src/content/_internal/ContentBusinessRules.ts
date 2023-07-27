import { EntityCapabilities, ICapabilityPermission } from "../../capabilities";
import { IPermissionPolicy } from "../../permissions";

/**
 * Default capabilities for a Content. If not listed here, the capability will not be available
 * This hash is combined with the capabilities hash stored in the item data. Regardless of what
 * properties are defined in the item data, only the capabilities defined here will be available
 * @private
 */
export const ContentDefaultCapabilities: EntityCapabilities = {
  overview: true,
  details: true,
  settings: true,
  dashboard: true,
};

/**
 * List of all the Content Capability Permissions
 * These are considered Hub Business Rules and are not intended
 * to be modified by consumers
 * @private
 */
export const ContentCapabilityPermissions: ICapabilityPermission[] = [
  {
    entity: "content",
    capability: "overview",
    permissions: ["hub:content:view"],
  },
  {
    entity: "content",
    capability: "dashboard",
    permissions: ["hub:content:edit"],
  },
  {
    entity: "content",
    capability: "details",
    permissions: ["hub:content:edit"],
  },
  {
    entity: "content",
    capability: "settings",
    permissions: ["hub:content:edit"],
  },
];

/**
 * Content Permission Policies
 * These define the requirements any user must meet to perform related actions
 * @private
 */
export const ContentPermissions = [
  "hub:content:create",
  // TODO: verify if this is needed:
  // "hub:content:delete",
  "hub:content:edit",
  "hub:content:view",
] as const;

/**
 * Content permission policies
 * @private
 */
export const ContentPermissionPolicies: IPermissionPolicy[] = [
  {
    permission: "hub:content:create",
    subsystems: ["content"],
    authenticated: true,
    privileges: ["portal:user:createItem"],
    licenses: ["hub-basic", "hub-premium", "enterprise-sites"],
  },
  {
    permission: "hub:content:view",
    subsystems: ["content"],
    authenticated: false,
    licenses: ["hub-basic", "hub-premium", "enterprise-sites"],
  },
  {
    permission: "hub:content:edit",
    authenticated: true,
    subsystems: ["content"],
    entityEdit: true,
    licenses: ["hub-basic", "hub-premium", "enterprise-sites"],
  },
  // TODO: verify if this is needed
  // {
  //   permission: "hub:content:delete",
  //   authenticated: true,
  //   subsystems: ["content"],
  //   entityOwner: true,
  //   licenses: ["hub-basic", "hub-premium", "enterprise-sites"],
  // },
];
