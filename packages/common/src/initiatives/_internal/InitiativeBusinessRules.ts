import { IFeatureFlags, IPermissionPolicy } from "../../permissions";

/**
 * Default features for a Initiative. These are the features that can be enabled / disabled by the entity owner
 */
export const InitiativeDefaultFeatures: IFeatureFlags = {
  "hub:initiative:events": false,
  "hub:initiative:content": true,
  "hub:initiative:discussions": false,
};

/**
 * Initiative Permission Policies
 * These define the requirements any user must meet to perform related actions
 * @private
 */
export const InitiativePermissions = [
  "hub:initiative",
  "hub:initiative:create",
  "hub:initiative:delete",
  "hub:initiative:edit",
  "hub:initiative:view",
  "hub:initiative:owner",
  "hub:initiative:canChangeAccess",
  "hub:initiative:events",
  "hub:initiative:content",
  "hub:initiative:discussions",
  "hub:initiative:workspace",
  "hub:initiative:workspace:overview",
  "hub:initiative:workspace:dashboard",
  "hub:initiative:workspace:details",
  "hub:initiative:workspace:metrics",
  "hub:initiative:workspace:projects",
  "hub:initiative:workspace:projects:member",
  "hub:initiative:workspace:projects:manager",
  "hub:initiative:workspace:settings",
  "hub:initiative:workspace:collaborators",
  "hub:initiative:workspace:metrics",
  "hub:initiative:workspace:catalogs", // deprecated -- should be removed
  "hub:initiative:workspace:catalog",
  "hub:initiative:workspace:catalog:content",
  "hub:initiative:workspace:catalog:events",
  "hub:initiative:workspace:associationGroup:create",
  "hub:initiative:manage",
] as const;

/**
 * Initiative permission policies
 * @private
 */
export const InitiativePermissionPolicies: IPermissionPolicy[] = [
  {
    permission: "hub:initiative",
    services: ["portal"],
    licenses: ["hub-premium"],
  },
  {
    permission: "hub:initiative:create",
    dependencies: ["hub:initiative"],
    authenticated: true,
    privileges: ["portal:user:createItem"],
  },
  {
    permission: "hub:initiative:view",
    services: ["portal"],
    authenticated: false,
    licenses: ["hub-premium", "hub-basic"],
  },
  {
    permission: "hub:initiative:owner",
    dependencies: ["hub:initiative"],
    authenticated: true,
    entityOwner: true,
  },
  {
    permission: "hub:initiative:edit",
    services: ["portal"],
    authenticated: true,
    entityEdit: true,
    licenses: ["hub-premium", "hub-basic"],
  },
  {
    permission: "hub:initiative:delete",
    dependencies: ["hub:initiative"],
    authenticated: true,
    entityDelete: true,
  },
  {
    permission: "hub:initiative:canChangeAccess",
    dependencies: ["hub:initiative"],
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
    permission: "hub:initiative:events",
    dependencies: ["hub:initiative:view"],
  },
  {
    permission: "hub:initiative:content",
    dependencies: ["hub:initiative:edit"],
  },
  {
    permission: "hub:initiative:discussions",
    dependencies: ["hub:initiative:view"],
  },
  {
    permission: "hub:initiative:workspace",
    dependencies: ["hub:feature:workspace"],
  },
  {
    permission: "hub:initiative:workspace:overview",
    dependencies: ["hub:initiative:workspace", "hub:initiative:view"],
  },
  {
    permission: "hub:initiative:workspace:dashboard",
    dependencies: ["hub:initiative:workspace", "hub:initiative:view"],
  },
  {
    permission: "hub:initiative:workspace:details",
    dependencies: ["hub:initiative:workspace", "hub:initiative:edit"],
  },
  {
    permission: "hub:initiative:workspace:metrics",
    dependencies: ["hub:initiative:workspace", "hub:initiative:edit"],
  },
  {
    permission: "hub:initiative:workspace:projects",
    dependencies: ["hub:initiative:workspace", "hub:initiative:edit"],
  },
  {
    permission: "hub:initiative:workspace:projects:member",
    dependencies: ["hub:initiative:workspace:projects"],
    assertions: [
      {
        property: "context:currentUser",
        type: "is-group-member",
        value: "entity:associations.groupId",
      },
    ],
  },
  {
    permission: "hub:initiative:workspace:projects:manager",
    dependencies: ["hub:initiative:workspace:projects"],
    assertions: [
      {
        property: "context:currentUser",
        type: "is-group-admin",
        value: "entity:associations.groupId",
      },
    ],
  },
  {
    permission: "hub:initiative:workspace:settings",
    dependencies: ["hub:initiative:workspace", "hub:initiative:edit"],
  },
  {
    permission: "hub:initiative:workspace:collaborators",
    dependencies: ["hub:initiative:workspace", "hub:initiative:edit"],
  },
  {
    permission: "hub:initiative:workspace:metrics",
    dependencies: ["hub:initiative:workspace", "hub:initiative:edit"],
  },
  // DEPRECATED PERMISSION - TODO: remove at next major version
  // Leverage singular "hub:initiative:workspace:catalog" instead
  {
    permission: "hub:initiative:workspace:catalogs", 
    dependencies: [
      "hub:initiative:workspace",
      "hub:feature:catalogs",
      "hub:initiative:edit",
    ],
  },
  {
    permission: "hub:initiative:workspace:catalog",
    dependencies: ["hub:initiative:workspace", "hub:initiative:edit"],
  },
  {
    permission: "hub:initiative:workspace:catalog:content",
    dependencies: ["hub:initiative:workspace:catalog"],
  },
  {
    permission: "hub:initiative:workspace:catalog:events",
    dependencies: [
      "hub:initiative:workspace:catalog",
      "hub:event",
      "hub:feature:catalogs:edit:advanced",
    ],
  },
  {
    permission: "hub:initiative:manage",
    dependencies: ["hub:initiative:edit"],
  },
  // permission to create an association group
  {
    permission: "hub:initiative:workspace:associationGroup:create",
    dependencies: ["hub:initiative:workspace:projects", "hub:group:create"],
  },
];
