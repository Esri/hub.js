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
  "hub:initiative:events",
  "hub:initiative:content",
  "hub:initiative:discussions",
  "hub:initiative:workspace",
  "hub:initiative:workspace:overview",
  "hub:initiative:workspace:dashboard",
  "hub:initiative:workspace:details",
  "hub:initiative:workspace:projects",
  "hub:initiative:workspace:projects:member",
  "hub:initiative:workspace:projects:manager",
  "hub:initiative:workspace:settings",
  "hub:initiative:workspace:collaborators",
  "hub:initiative:workspace:content",
  "hub:initiative:workspace:metrics",
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
    permission: "hub:initiative:edit",
    dependencies: ["hub:initiative"],
    authenticated: true,
    entityEdit: true,
  },
  {
    permission: "hub:initiative:delete",
    dependencies: ["hub:initiative"],
    authenticated: true,

    entityOwner: true,
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
    environments: ["devext", "qaext"],
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
    entityOwner: true,
  },
  {
    permission: "hub:initiative:workspace:collaborators",
    dependencies: ["hub:initiative:workspace", "hub:initiative:edit"],
  },
  {
    permission: "hub:initiative:workspace:content",
    dependencies: ["hub:initiative:workspace", "hub:initiative:edit"],
  },
  {
    permission: "hub:initiative:workspace:metrics",
    dependencies: ["hub:initiative:workspace", "hub:initiative:edit"],
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
