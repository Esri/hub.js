import { IPermissionPolicy } from "../../permissions/types/IPermissionPolicy";

/**
 * survey Permission Policies
 * These define the requirements any user must meet to perform related actions
 * @private
 */
export const SurveyPermissions = [
  "hub:survey",
  "hub:survey:create",
  "hub:survey:delete",
  "hub:survey:edit",
  "hub:survey:view",
  "hub:survey:view:related",
  "hub:survey:owner",
  "hub:survey:canChangeAccess",
  "hub:survey:workspace",
  "hub:survey:workspace:dashboard",
  "hub:survey:workspace:details",
  "hub:survey:workspace:settings",
  "hub:survey:workspace:collaborators",
  "hub:survey:manage",
] as const;

/**
 * Survey permission policies
 * @private
 */
export const SurveyPermissionPolicies: IPermissionPolicy[] = [
  {
    permission: "hub:survey",
    services: ["portal"],
    licenses: ["hub-basic", "hub-premium"],
  },
  {
    permission: "hub:survey:view",
    dependencies: ["hub:survey"],
  },
  {
    permission: "hub:survey:view:related",
    dependencies: ["hub:survey:view"],
    services: ["hub-search"],
    assertions: [
      {
        property: "entity:access",
        type: "eq",
        value: "public",
      },
    ],
  },
  {
    permission: "hub:survey:create",
    authenticated: true,
    dependencies: ["hub:survey"],
    privileges: [
      "features:user:edit",
      "portal:publisher:publishFeatures",
      "portal:user:createItem",
      "portal:user:shareToGroup",
    ],
  },
  {
    permission: "hub:survey:edit",
    authenticated: true,
    dependencies: ["hub:survey"],
    entityEdit: true,
  },
  {
    permission: "hub:survey:delete",
    authenticated: true,
    dependencies: ["hub:survey"],
    entityDelete: true,
  },
  {
    permission: "hub:survey:owner",
    dependencies: ["hub:survey"],
    authenticated: true,
    entityOwner: true,
  },
  {
    permission: "hub:survey:canChangeAccess",
    dependencies: ["hub:survey"],
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
    permission: "hub:survey:workspace",
    dependencies: ["hub:feature:workspace"],
  },
  {
    permission: "hub:survey:workspace:dashboard",
    dependencies: ["hub:survey:workspace", "hub:survey:view"],
  },
  {
    permission: "hub:survey:workspace:details",
    dependencies: ["hub:survey:workspace", "hub:survey:edit"],
  },
  {
    permission: "hub:survey:workspace:settings",
    dependencies: ["hub:survey:workspace", "hub:survey:edit"],
  },
  {
    permission: "hub:survey:workspace:collaborators",
    dependencies: ["hub:survey:workspace", "hub:survey:edit"],
  },
  {
    permission: "hub:survey:manage",
    dependencies: ["hub:survey:edit"],
  },
];
