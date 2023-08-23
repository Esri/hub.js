import { IEntityFeatures, IPermissionPolicy } from "../../permissions";

/**
 * Default features for a Content item. Intentionally empty to prevent overriding and adding features
 */
export const ContentDefaultFeatures: IEntityFeatures = {
  // Intentally empty as this prevents overriding and adding features
};

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
