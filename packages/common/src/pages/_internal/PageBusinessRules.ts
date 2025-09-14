import { IFeatureFlags, IPermissionPolicy } from "../../permissions";

/**
 * Default features for a Project. These are the features that can be enabled / disabled by the entity owner
 */
export const PageDefaultFeatures: IFeatureFlags = {
  // Intentally empty as this prevents overriding and adding features
};

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
    entityDelete: true,
  },
  {
    permission: "hub:page:canChangeAccess",
    dependencies: ["hub:page"],
    authenticated: true,
    assertions: [
      {
        property: "context:currentUser.privileges",
        type: "contains-some",
        value: [
          "portal:admin:shareToPublic",
          "portal:admin:shareToOrg",
          "portal:user:shareToPublic",
          "portal:user:shareToOrg",
        ],
      },
      {
        property: "entity:itemControl",
        type: "eq",
        value: "admin",
      },
    ],
  },
  {
    permission: "hub:page:workspace",
    dependencies: ["hub:feature:workspace"],
  },
  {
    permission: "hub:page:workspace:overview",
    availability: ["alpha"],
    dependencies: ["hub:page:workspace", "hub:page:view"],
  },
  {
    permission: "hub:page:workspace:dashboard",
    dependencies: ["hub:page:workspace", "hub:page:view"],
  },
  {
    permission: "hub:page:workspace:details",
    dependencies: ["hub:page:workspace", "hub:page:edit"],
  },
  {
    permission: "hub:page:workspace:collaborators",
    dependencies: ["hub:page:workspace", "hub:page:edit"],
  },
  {
    permission: "hub:page:workspace:settings",
    dependencies: ["hub:page:workspace", "hub:page:edit"],
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
