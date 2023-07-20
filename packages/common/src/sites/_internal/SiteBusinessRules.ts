import { EntityCapabilities, ICapabilityPermission } from "../../capabilities";
import { IPermissionPolicy } from "../../permissions/types";

/**
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
};

/**
 * List of all the Site Capability Permissions
 * These are considered Hub Business Rules and are not intended
 * to be modified by consumers
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
    permissions: ["hub:site:edit"],
  },
  {
    entity: "site",
    capability: "content",
    permissions: ["hub:site:edit"],
  },
  {
    entity: "site",
    capability: "disableActivityTracking",
    permissions: ["hub:site:view"],
  },
  //
];

/**
 * Site Permissions
 * This feeds into the Permissions type
 */
export const SitePermissions = [
  "hub:site:create",
  "hub:site:delete",
  "hub:site:edit",
  "hub:site:view",
] as const;

/**
 * Site permission policies
 * @private
 */
export const SitesPermissionPolicies: IPermissionPolicy[] = [
  {
    permission: "hub:site:create",
    subsystems: ["sites"],
    authenticated: true,
    privileges: ["portal:user:createItem"],
    licenses: ["hub-basic", "hub-premium", "enterprise-sites"],
  },
  {
    permission: "hub:site:view",
    subsystems: ["sites"],
    authenticated: false,
    licenses: ["hub-basic", "hub-premium", "enterprise-sites"],
  },
  {
    permission: "hub:site:delete",
    subsystems: ["sites"],
    authenticated: true,
    licenses: ["hub-basic", "hub-premium", "enterprise-sites"],
    entityOwner: true,
  },
  {
    permission: "hub:site:edit",
    entityEdit: true,
    subsystems: ["sites"],
    authenticated: true,
    licenses: ["hub-basic", "hub-premium", "enterprise-sites"],
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
