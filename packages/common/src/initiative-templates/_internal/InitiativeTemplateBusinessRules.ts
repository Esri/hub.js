import { IFeatureFlags, IPermissionPolicy } from "../../permissions";

/**
 * Default features for an Initiative Template. These are the features that can be enabled / disabled by the entity owner
 */
export const InitiativeTemplateDefaultFeatures: IFeatureFlags = {
  // empty for now
};

/**
 * Initiative Template Permission Policies
 * These define the requirements any user must meet to perform related actions
 * @private
 */
export const InitiativeTemplatePermissions = [
  "hub:initiativeTemplate",
  "hub:initiativeTemplate:create",
  "hub:initiativeTemplate:delete",
  "hub:initiativeTemplate:edit",
  "hub:initiativeTemplate:view",
  "hub:initiativeTemplate:canChangeAccess",
  "hub:initiativeTemplate:workspace",
  "hub:initiativeTemplate:workspace:dashboard",
  "hub:initiativeTemplate:workspace:details",
  "hub:initiativeTemplate:workspace:collaborators",
  "hub:initiativeTemplate:workspace:settings",
  "hub:initiativeTemplate:manage",
] as const;

/**
 * Initiative Template policies
 * @private
 */
export const InitiativeTemplatePermissionPolicies: IPermissionPolicy[] = [
  {
    permission: "hub:initiativeTemplate",
    services: ["portal"],
  },
  {
    permission: "hub:initiativeTemplate:create",
    dependencies: ["hub:initiativeTemplate"],
    authenticated: true,
    privileges: ["portal:user:createItem"],
  },
  {
    permission: "hub:initiativeTemplate:view",
    dependencies: ["hub:initiativeTemplate"],
  },
  {
    permission: "hub:initiativeTemplate:edit",
    dependencies: ["hub:initiativeTemplate"],
    authenticated: true,
    entityEdit: true,
  },
  {
    permission: "hub:initiativeTemplate:delete",
    dependencies: ["hub:initiativeTemplate"],
    authenticated: true,
    entityOwner: true,
  },
  {
    permission: "hub:initiativeTemplate:canChangeAccess",
    dependencies: ["hub:initiativeTemplate"],
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
    permission: "hub:initiativeTemplate:workspace",
    dependencies: ["hub:feature:workspace"],
  },
  {
    permission: "hub:initiativeTemplate:workspace:dashboard",
    dependencies: [
      "hub:initiativeTemplate:workspace",
      "hub:initiativeTemplate:edit",
    ],
  },
  {
    permission: "hub:initiativeTemplate:workspace:details",
    dependencies: [
      "hub:initiativeTemplate:workspace",
      "hub:initiativeTemplate:edit",
    ],
  },
  {
    permission: "hub:initiativeTemplate:workspace:collaborators",
    dependencies: [
      "hub:initiativeTemplate:workspace",
      "hub:initiativeTemplate:edit",
    ],
  },
  {
    permission: "hub:initiativeTemplate:workspace:settings",
    dependencies: [
      "hub:initiativeTemplate:workspace",
      "hub:initiativeTemplate:edit",
    ],
  },
  {
    permission: "hub:initiativeTemplate:manage",
    dependencies: ["hub:initiativeTemplate:edit"],
  },
];
