import { EntityCapabilities, ICapabilityPermission } from "../../capabilities";
import { IEntityFeatures, IPermissionPolicy } from "../../permissions/types";

/**
 * DEPRECATED
 * Default capabilities for a Site. If not listed here, the capability will not be available
 * This hash is combined with the capabilities hash stored in the item data. Regardless of what
 * properties are defined in the item data, only the capabilities defined here will be available
 * @private
 */
export const SiteDefaultCapabilities: EntityCapabilities = {
  overview: true,
  details: true,
  settings: true,
  content: true,
  dashboard: true,
};

/**
 * DEPRECATED
 * List of all the Site Capability Permissions
 * These are considered Hub Business Rules and are not intended
 * to be modified by consumers
 * @private
 */
export const SiteCapabilityPermissions: ICapabilityPermission[] = [
  {
    entity: "site",
    capability: "overview",
    permissions: ["hub:site:view"],
  },
  {
    entity: "site",
    capability: "details",
    permissions: ["hub:site:edit"],
  },
  {
    entity: "site",
    capability: "settings",
    permissions: ["hub:site:edit", "hub:site:view"],
  },
  {
    entity: "site",
    capability: "content",
    permissions: ["hub:site:edit"],
  },
  {
    entity: "site",
    capability: "dashboard",
    permissions: ["hub:site:edit"],
  },
];

/**
 * Default features for a Site. These are the features that can be enabled / disabled by the entity owner
 */
export const SiteDefaultFeatures: IEntityFeatures = {
  "hub:site:events": false,
  "hub:site:content": true,
  "hub:site:discussions": false,
};

/**
 * Site Permissions
 * This feeds into the Permissions type
 */
export const SitePermissions = [
  "hub:site",
  "hub:site:create",
  "hub:site:delete",
  "hub:site:edit",
  "hub:site:view",
  "hub:site:owner",
  "hub:site:events",
  "hub:site:content",
  "hub:site:discussions",
] as const;

/**
 * Site permission policies
 * @private
 */
export const SitesPermissionPolicies: IPermissionPolicy[] = [
  {
    permission: "hub:site",
    services: ["portal"],
    licenses: ["hub-basic", "hub-premium", "enterprise-sites"],
  },
  {
    permission: "hub:site:create",
    dependencies: ["hub:site"],
    authenticated: true,
    privileges: ["portal:user:createItem"],
  },
  {
    permission: "hub:site:view",
    dependencies: ["hub:site"],
    authenticated: false,
  },
  {
    permission: "hub:site:delete",
    dependencies: ["hub:site"],
    authenticated: true,
    entityOwner: true,
  },
  {
    permission: "hub:site:edit",
    entityEdit: true,
    dependencies: ["hub:site"],
    authenticated: true,
  },
  {
    permission: "hub:site:events",
    dependencies: ["hub:site:view"],
  },
  {
    permission: "hub:site:content",
    dependencies: ["hub:site:edit"],
  },
  {
    permission: "hub:site:discussions",
    dependencies: ["hub:site:view"],
  },
];

/**
 * Site versioning include list
 */
export const SiteVersionIncludeList = [
  "data.values.layout",
  "data.values.theme",
  "data.values.headContent",
];
