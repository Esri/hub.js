import { IFeatureFlags, IPermissionPolicy } from "../../permissions/types";

/**
 * Default features for a Site. These are the features that can be enabled / disabled by the entity owner
 */
export const SiteDefaultFeatures: IFeatureFlags = {
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
  "hub:site:workspace:overview",
  "hub:site:workspace:dashboard",
  "hub:site:workspace:details",
  "hub:site:workspace:settings",
  "hub:site:workspace:collaborators",
  "hub:site:workspace:content",
  "hub:site:workspace:metrics",
  "hub:site:workspace:followers",
  "hub:site:workspace:followers:member",
  "hub:site:workspace:followers:manager",
  "hub:site:manage",
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
  {
    permission: "hub:site:workspace:overview",
    dependencies: ["hub:site:view"],
  },
  {
    permission: "hub:site:workspace:dashboard",
    dependencies: ["hub:site:view"],
  },
  {
    permission: "hub:site:workspace:details",
    dependencies: ["hub:site:edit"],
  },
  {
    permission: "hub:site:workspace:settings",
    dependencies: ["hub:site:edit"],
    entityOwner: true,
  },
  {
    permission: "hub:site:workspace:collaborators",
    dependencies: ["hub:site:edit"],
  },
  {
    permission: "hub:site:workspace:content",
    dependencies: ["hub:site:edit"],
  },
  {
    permission: "hub:site:workspace:metrics",
    dependencies: ["hub:site:edit"],
    environments: ["devext", "qaext"],
  },
  {
    permission: "hub:site:workspace:followers",
    dependencies: ["hub:site:edit"],
  },
  {
    permission: "hub:site:workspace:followers:member",
    dependencies: ["hub:site:workspace:followers"],
    assertions: [
      {
        property: "context:currentUser",
        type: "is-group-member",
        value: "entity:followersGroupId",
      },
    ],
  },
  {
    permission: "hub:site:workspace:followers:manager",
    dependencies: ["hub:site:workspace:followers"],
    assertions: [
      {
        property: "context:currentUser",
        type: "is-group-admin",
        value: "entity:followersGroupId",
      },
    ],
  },
  {
    permission: "hub:site:manage",
    dependencies: ["hub:site:edit"],
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
