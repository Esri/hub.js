import { EntityCapabilities, ICapabilityPermission } from "../../capabilities";
import { IEntityFeatures, IPermissionPolicy } from "../../permissions";

/**
 * Default capabilities for a Page. If not listed here, the capability will not be available
 * This hash is combined with the capabilities hash stored in the item data. Regardless of what
 * properties are defined in the item data, only the capabilities defined here will be available
 * @private
 * TODO: Remove capabilities
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
 * TODO: Remove capabilities
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
 * Default features for a Project. These are the features that can be enabled / disabled by the entity owner
 */
export const PageDefaultFeatures: IEntityFeatures = {
  // Intentally empty as this prevents overriding and adding features
};

/**
 * Page Permission Policies
 * These define the requirements any user must meet to perform related actions
 * @private
 */
export const PagePermissions = [
  "hub:page",
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
    permission: "hub:page",
    services: ["portal"],
  },
  {
    permission: "hub:page:create",
    dependencies: ["hub:page"],
    authenticated: true,
    privileges: ["portal:user:createItem"],
  },
  {
    permission: "hub:page:view",
    dependencies: ["hub:page"],
  },
  {
    permission: "hub:page:edit",
    dependencies: ["hub:page"],
    authenticated: true,
    entityEdit: true,
  },
  {
    permission: "hub:page:delete",
    dependencies: ["hub:page"],
    authenticated: true,
    entityOwner: true,
  },
];

/**
 * Page versioning include list
 */
export const PageVersionIncludeList = [
  "data.values.layout",
  "data.values.headContent",
];
