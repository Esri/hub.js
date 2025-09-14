import { IFeatureFlags, IPermissionPolicy } from "../../permissions";

/**
 * Default features for a Project. These are the features that can be enabled / disabled by the entity owner
 */
export const ProjectDefaultFeatures: IFeatureFlags = {
  "hub:project:events": false,
  "hub:project:content": true,
  "hub:project:discussions": false,
};

/**
 * Project permission policies
 * @private
 */
export const ProjectPermissionPolicies: IPermissionPolicy[] = [
  {
    permission: "hub:project",
    services: ["portal"],
    licenses: ["hub-premium"],
  },
  {
    permission: "hub:project:create",
    authenticated: true,
    dependencies: ["hub:project"],
    privileges: ["portal:user:createItem"],
  },
  {
    // Anyone can view a project
    permission: "hub:project:view",
    services: ["portal"],
  },
  {
    permission: "hub:project:edit",
    services: ["portal"],
    authenticated: true,
    entityEdit: true,
    licenses: ["hub-premium", "hub-basic"],
  },
  {
    permission: "hub:project:delete",
    dependencies: ["hub:project"],
    authenticated: true,
    entityDelete: true,
  },
  {
    permission: "hub:project:owner",
    dependencies: ["hub:project"],
    authenticated: true,
    entityOwner: true,
  },
  {
    permission: "hub:project:canChangeAccess",
    dependencies: ["hub:project"],
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
    permission: "hub:project:events",
    dependencies: ["hub:project:view"],
    entityConfigurable: true,
  },
  {
    permission: "hub:project:content",
    dependencies: ["hub:project:edit"],
  },
  {
    permission: "hub:project:discussions",
    dependencies: ["hub:project:view"],
  },
  {
    permission: "hub:project:associations",
    dependencies: ["hub:project:view"],
  },
  {
    permission: "hub:project:workspace",
  },
  {
    permission: "hub:project:workspace:overview",
    dependencies: ["hub:project:workspace", "hub:project:view"],
  },
  {
    permission: "hub:project:workspace:dashboard",
    dependencies: ["hub:project:workspace", "hub:project:view"],
  },
  {
    permission: "hub:project:workspace:details",
    dependencies: ["hub:project:workspace", "hub:project:edit"],
  },
  {
    permission: "hub:project:workspace:initiatives",
    dependencies: [
      "hub:project:workspace",
      "hub:project:associations",
      "hub:project:edit",
    ],
  },
  {
    permission: "hub:project:workspace:settings",
    dependencies: ["hub:project:workspace", "hub:project:edit"],
  },
  {
    permission: "hub:project:workspace:collaborators",
    dependencies: ["hub:project:workspace", "hub:project:edit"],
  },
  {
    permission: "hub:project:workspace:metrics",
    dependencies: ["hub:project:workspace", "hub:project:edit"],
  },
  {
    permission: "hub:project:workspace:catalog",
    dependencies: ["hub:project:workspace", "hub:project:edit"],
  },
  {
    permission: "hub:project:workspace:catalog:content",
    dependencies: ["hub:project:workspace:catalog"],
  },
  {
    permission: "hub:project:workspace:catalog:events",
    dependencies: [
      "hub:project:workspace:catalog",
      "hub:event",
      "hub:feature:catalogs:edit:advanced",
    ],
  },
  {
    permission: "hub:project:manage",
    dependencies: ["hub:project:edit"],
  },
];
