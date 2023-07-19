import { EntityCapabilities, ICapabilityPermission } from "../../capabilities";
import { IPermissionPolicy } from "../../permissions";

/**
 * Default capabilities for a Page. If not listed here, the capability will not be available
 * This hash is combined with the capabilities hash stored in the item data. Regardless of what
 * properties are defined in the item data, only the capabilities defined here will be available
 * @private
 */
export const PageDefaultCapabilities: EntityCapabilities = {
  overview: true,
  details: true,
  settings: true,
  dashboard: true,
};

/**
 * List of all the Page Capability Permissions
 * These are considered Hub Business Rules and are not intended
 * to be modified by consumers
 * @private
 */
export const PageCapabilityPermissions: ICapabilityPermission[] = [
  {
    entity: "page",
    capability: "overview",
    permissions: ["hub:page:view"],
  },
  {
    entity: "page",
    capability: "details",
    permissions: ["hub:page:edit"],
  },
  {
    entity: "page",
    capability: "settings",
    permissions: ["hub:page:edit"],
  },
  {
    entity: "page",
    capability: "dashboard",
    permissions: ["hub:page:edit"],
  },
];

/**
 * Page Permission Policies
 * These define the requirements any user must meet to perform related actions
 * @private
 */
export const PagePermissions = [
  "hub:page:create",
  "hub:page:delete",
  "hub:page:edit",
  "hub:page:view",
] as const;

/**
 * Page permission policies
 * @private
 */
export const PagePermissionPolicies: IPermissionPolicy[] = [
  {
    permission: "hub:page:create",
    subsystems: ["pages", "sites"],
    authenticated: true,
    privileges: ["portal:user:createItem"],
    licenses: ["hub-basic", "hub-premium", "enterprise-sites"],
  },
  {
    permission: "hub:page:view",
    subsystems: ["pages", "sites"],
    authenticated: false,
    licenses: ["hub-basic", "hub-premium", "enterprise-sites"],
  },
  {
    permission: "hub:page:edit",
    authenticated: true,
    subsystems: ["pages", "sites"],
    entityEdit: true,
    // privileges: ["portal:admin:updateItems"], // maybe this too?
    licenses: ["hub-basic", "hub-premium", "enterprise-sites"],
  },
  {
    permission: "hub:page:delete",
    authenticated: true,
    subsystems: ["pages", "sites"],
    entityOwner: true,
    // privileges: ["portal:admin:deleteItems"], // maybe this too?
    licenses: ["hub-basic", "hub-premium", "enterprise-sites"],
  },
];

/**
 * Page versioning include list
 */
export const PageVersionIncludeList = [
  "data.values.layout",
  "data.values.headContent",
];
