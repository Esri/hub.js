import { IPermissionPolicy } from "../../permissions";

/**
 * Event Permission Policies
 * These define the requirements any user must meet to perform related actions
 * @private
 */
export const EventPermissions = [
  "hub:event",
  "hub:event:create",
  "hub:event:edit",
  "hub:event:delete",
  "hub:event:view",
  "hub:event:owner",
  "hub:event:canChangeAccess",
  "hub:event:workspace",
  "hub:event:workspace:dashboard",
  "hub:event:workspace:details",
  "hub:event:workspace:settings",
  "hub:event:workspace:collaborators",
  "hub:event:workspace:manage",
] as const;

/**
 * Event permission policies
 * @private
 */
export const EventPermissionPolicies: IPermissionPolicy[] = [
  {
    permission: "hub:event",
    services: ["events"],
    licenses: ["hub-basic", "hub-premium"],
    environments: ["devext", "qaext"],
    availability: ["alpha"],
  },
  {
    permission: "hub:event:create",
    dependencies: ["hub:event"],
    authenticated: true,
    privileges: ["portal:user:createItem"],
    licenses: ["hub-premium"],
  },
  {
    permission: "hub:event:view",
    dependencies: ["hub:event"],
  },
  {
    permission: "hub:event:edit",
    authenticated: true,
    dependencies: ["hub:event"],
    entityEdit: true,
    licenses: ["hub-premium"],
  },
  {
    permission: "hub:event:delete",
    authenticated: true,
    dependencies: ["hub:event"],
    entityOwner: true,
    licenses: ["hub-premium"],
  },
  {
    permission: "hub:event:owner",
    dependencies: ["hub:event"],
    authenticated: true,
    entityOwner: true,
  },
  {
    permission: "hub:event:canChangeAccess",
    dependencies: ["hub:event"],
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
        property: "entity:canChangeAccess",
        type: "eq",
        value: true,
      },
    ],
  },
  {
    permission: "hub:event:workspace",
    dependencies: ["hub:feature:workspace"],
    environments: ["devext", "qaext"],
  },
  {
    permission: "hub:event:workspace:overview",
    dependencies: ["hub:event:workspace", "hub:event:view"],
  },
  {
    permission: "hub:event:workspace:dashboard",
    dependencies: ["hub:event:workspace", "hub:event:view"],
  },
  {
    permission: "hub:event:workspace:details",
    dependencies: ["hub:event:workspace", "hub:event:edit"],
  },
  {
    permission: "hub:event:workspace:settings",
    dependencies: ["hub:event:workspace", "hub:event:edit"],
  },
  {
    permission: "hub:event:workspace:collaborators",
    dependencies: ["hub:event:workspace", "hub:event:edit"],
  },
  {
    permission: "hub:event:manage",
    dependencies: ["hub:event:edit"],
  },
];
