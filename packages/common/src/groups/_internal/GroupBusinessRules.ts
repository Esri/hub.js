import { IPermissionPolicy } from "../../permissions";

/**
 * Group Permission Policies
 * These define the requirements any user must meet to perform related actions
 * @private
 */
export const GroupPermissions = [
  "hub:group",
  "hub:group:create",
  "hub:group:delete",
  "hub:group:edit",
  "hub:group:view",
  "hub:group:owner",
  "hub:group:workspace",
  "hub:group:workspace:overview",
  "hub:group:workspace:dashboard",
  "hub:group:workspace:details",
  "hub:group:workspace:discussion",
  "hub:group:workspace:settings",
  "hub:group:workspace:collaborators",
  "hub:group:workspace:content",
  "hub:group:workspace:members",
  "hub:group:shareContent",
  "hub:group:manage",
] as const;

/**
 * Group permission policies
 * @private
 */
export const GroupPermissionPolicies: IPermissionPolicy[] = [
  {
    permission: "hub:group",
    services: ["portal"],
  },
  {
    permission: "hub:group:create",
    dependencies: ["hub:group"],
    authenticated: true,
    privileges: ["portal:user:createGroup"],
    assertions: [
      {
        property: "context:currentUser.groups",
        type: "length-lt",
        value: "context:portal.limits.MaxNumUserGroups",
      },
    ],
  },
  {
    permission: "hub:group:view",
    dependencies: ["hub:group"],
  },
  {
    permission: "hub:group:edit",
    dependencies: ["hub:group"],
    authenticated: true,
    entityEdit: true,
  },
  {
    permission: "hub:group:delete",
    dependencies: ["hub:group"],
    authenticated: true,
    entityOwner: true,
  },
  {
    permission: "hub:group:owner",
    dependencies: ["hub:group"],
    authenticated: true,
    entityOwner: true,
  },
  {
    permission: "hub:group:workspace",
    dependencies: ["hub:feature:workspace"],
  },
  {
    permission: "hub:group:workspace:details",
    dependencies: ["hub:group:workspace", "hub:group:edit"],
  },
  {
    permission: "hub:group:workspace:discussion",
    dependencies: ["hub:group:workspace", "hub:group:edit"],
  },
  {
    permission: "hub:group:workspace:settings",
    dependencies: ["hub:group:workspace", "hub:group:edit"],
  },
  {
    permission: "hub:group:workspace:content",
    dependencies: ["hub:group:workspace", "hub:group:view"],
  },
  {
    permission: "hub:group:workspace:members",
    dependencies: ["hub:group:workspace", "hub:group:view"],
  },
  {
    permission: "hub:group:shareContent",
    dependencies: ["hub:group"],
    authenticated: true,
    privileges: ["portal:user:shareToGroup"],
    assertions: [
      {
        property: "context:currentUser",
        type: "is-group-member",
        value: "entity:id",
      },
    ],
  },
  {
    permission: "hub:group:manage",
    dependencies: ["hub:group:edit"],
  },
];
