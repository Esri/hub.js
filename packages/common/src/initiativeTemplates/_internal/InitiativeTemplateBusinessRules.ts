import { IFeatureFlags, IPermissionPolicy } from "../../permissions";

/**
 * Default features for an Initiative Template. These are the features that can be enabled / disabled by the entity owner
 */
export const InitiativeTemplateDefaultFeatures: IFeatureFlags = {
  // TODO
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
  "hub:initiativeTemplate:workspace:overview",
  "hub:initiativeTemplate:workspace:details",
  "hub:initiativeTemplate:worskpace:collaborators",
  "hub:initaitiveTemplate:workspace:settings",
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
    permission: "hub:initiativeTemplate:workspace:overview",
    dependencies: ["hub:initiativeTemplate:view"],
  },
  {
    permission: "hub:initiativeTemplate:workspace:details",
    dependencies: ["hub:initiativeTemplate:edit"],
  },
  {
    permission: "hub:initiativeTemplate:workspace:collaborators",
    dependencies: ["hub:initiativeTemplate:edit"],
  },
  {
    permission: "hub:initiativeTemplate:workspace:settings",
    dependencies: ["hub:initiativeTemplate:edit"],
    entityOwner: true,
  },
  {
    permission: "hub:initiativeTemplate:manage",
    dependencies: ["hub:initiativeTemplate:edit"],
  },
];
