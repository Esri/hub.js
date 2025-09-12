import { IPermissionPolicy } from "../../permissions";

/**
 * Discussion permission policies
 * @private
 */
export const DiscussionPermissionPolicies: IPermissionPolicy[] = [
  {
    permission: "hub:discussion",
    services: ["discussions"],
  },
  {
    permission: "hub:discussion:create",
    dependencies: ["hub:discussion"],
    authenticated: true,
    privileges: ["portal:user:createItem"],
    licenses: ["hub-premium"],
  },
  {
    permission: "hub:discussion:view",
    dependencies: ["hub:discussion"],
    authenticated: false,
    licenses: ["hub-basic", "hub-premium"],
  },
  {
    permission: "hub:discussion:edit",
    authenticated: true,
    dependencies: ["hub:discussion"],
    licenses: ["hub-basic", "hub-premium"],
    entityEdit: true,
  },
  {
    permission: "hub:discussion:delete",
    authenticated: true,
    dependencies: ["hub:discussion"],
    licenses: ["hub-basic", "hub-premium"],
    entityDelete: true,
  },
  {
    permission: "hub:discussion:owner",
    dependencies: ["hub:discussion"],
    authenticated: true,
    entityOwner: true,
  },
  {
    permission: "hub:discussion:canChangeAccess",
    dependencies: ["hub:discussion"],
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
    permission: "hub:discussion:workspace:overview",
    dependencies: ["hub:discussion:view"],
  },
  {
    permission: "hub:discussion:workspace:dashboard",
    dependencies: ["hub:discussion:view"],
  },
  {
    permission: "hub:discussion:workspace:details",
    dependencies: ["hub:discussion:edit"],
  },
  {
    permission: "hub:discussion:workspace:settings",
    dependencies: ["hub:discussion:edit"],
  },
  {
    permission: "hub:discussion:workspace:settings:discussions",
    dependencies: ["hub:discussion:edit"],
  },
  {
    permission: "hub:discussion:workspace:collaborators",
    dependencies: ["hub:discussion:edit"],
  },
  {
    permission: "hub:discussion:workspace:metrics",
    dependencies: ["hub:discussion:edit"],
  },
  {
    permission: "hub:discussion:manage",
    dependencies: ["hub:discussion:edit"],
  },
  {
    permission: "hub:discussion:workspace:catalog",
    dependencies: ["hub:discussion:edit"],
  },
  {
    permission: "hub:discussion:workspace:catalog:content",
    dependencies: ["hub:discussion:workspace:catalog"],
  },
  {
    permission: "hub:discussion:workspace:catalog:events",
    dependencies: [
      "hub:discussion:workspace:catalog",
      "hub:event",
      "hub:feature:catalogs:edit:advanced",
    ],
  },
];
