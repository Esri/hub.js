import { EntityCapabilities, ICapabilityPermission } from "../../capabilities";
import { IPermissionPolicy } from "../../permissions";

/**
 * Default capabilities for a Content. If not listed here, the capability will not be available
 * This hash is combined with the capabilities hash stored in the item data. Regardless of what
 * properties are defined in the item data, only the capabilities defined here will be available
 * @private
 * TODO: remove with Capabilities
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
 * TODO: remove with Capabilities
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
  "hub:content:workspace:overview",
  "hub:content:workspace:dashboard",
  "hub:content:workspace:details",
  "hub:content:workspace:settings",
] as const;

/**
 * Content permission policies
 * No need to specify license for permissions that are available to all licenses
 * @private
 */
export const ContentPermissionPolicies: IPermissionPolicy[] = [
  {
    permission: "hub:content:create",
    services: ["portal"],
    authenticated: true,
    privileges: ["portal:user:createItem"],
  },
  {
    permission: "hub:content:view",
    services: ["portal"],
    authenticated: false,
  },
  {
    permission: "hub:content:edit",
    authenticated: true,
    services: ["portal"],
    entityEdit: true,
  },
  // TODO: verify if this is needed
  // {
  //   permission: "hub:content:delete",
  //   authenticated: true,
  //   entityOwner: true,
  //   licenses: ["hub-basic", "hub-premium", "enterprise-sites"],
  // },
  {
    permission: "hub:content:workspace:overview",
    dependencies: ["hub:content:view"],
  },
  {
    permission: "hub:content:workspace:dashboard",
    dependencies: ["hub:content:view"],
  },
  {
    permission: "hub:content:workspace:details",
    dependencies: ["hub:content:edit"],
  },
  {
    permission: "hub:content:workspace:settings",
    dependencies: ["hub:content:edit"],
    entityOwner: true,
  },
];
