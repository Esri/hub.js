import { IFeatureFlags, IPermissionPolicy } from "../../permissions";

/**
 * Default features for a Project. These are the features that can be enabled / disabled by the entity owner
 */
export const PageDefaultFeatures: IFeatureFlags = {
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
  "hub:page:workspace:overview",
  "hub:page:workspace:dashboard",
  "hub:page:workspace:details",
  "hub:page:workspace:settings",
  "hub:page:workspace:collaborators",
  "hub:page:manage",
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
  {
    permission: "hub:page:workspace:overview",
    dependencies: ["hub:page:view"],
  },
  {
    permission: "hub:page:workspace:dashboard",
    dependencies: ["hub:page:view"],
  },
  {
    permission: "hub:page:workspace:details",
    dependencies: ["hub:page:edit"],
  },
  {
    permission: "hub:page:workspace:collaborators",
    dependencies: ["hub:page:edit"],
  },
  {
    permission: "hub:page:workspace:settings",
    dependencies: ["hub:page:edit"],
    entityOwner: true,
  },
  {
    permission: "hub:page:manage",
    dependencies: ["hub:page:edit"],
  },
];

/**
 * Page versioning include list
 */
export const PageVersionIncludeList = [
  "data.values.layout",
  "data.values.headContent",
];
