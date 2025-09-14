import { IPermissionPolicy } from "../../permissions";

/**
 * @private
 * Event permission policies
 */
export const EventPermissionPolicies: IPermissionPolicy[] = [
  {
    permission: "hub:event",
    services: ["events"],
    // gate to users that are opted into workspace
    dependencies: ["hub:feature:workspace"],
    licenses: ["hub-premium"],
  },
  {
    permission: "hub:event:create",
    dependencies: ["hub:event"],
    authenticated: true,
    privileges: ["portal:user:createItem"],
  },
  {
    permission: "hub:event:view",
    services: ["events"],
    licenses: ["hub-basic", "hub-premium"],
  },
  {
    permission: "hub:event:edit",
    authenticated: true,
    services: ["events"],
    dependencies: ["hub:feature:workspace"],
    // any hub-basic or hub-premium user with edit authorization (via an edit/update group) can edit the event (when opted into workspace)
    licenses: ["hub-basic", "hub-premium"],
    entityEdit: true,
  },
  {
    permission: "hub:event:delete",
    authenticated: true,
    dependencies: ["hub:event"],
    entityDelete: true,
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
    // gate to users that are opted into workspace
    dependencies: ["hub:feature:workspace"],
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
    permission: "hub:event:workspace:registrants",
    dependencies: ["hub:event:workspace", "hub:event:edit"],
  },
  {
    permission: "hub:event:workspace:content",
    dependencies: ["hub:event:workspace", "hub:event:edit"],
  },
  {
    permission: "hub:event:workspace:catalog",
    dependencies: ["hub:event:workspace", "hub:event:edit"],
  },
  {
    permission: "hub:event:workspace:catalog:content",
    dependencies: ["hub:event:workspace:catalog"],
  },
  {
    permission: "hub:event:workspace:catalog:events",
    dependencies: [
      "hub:event:workspace:catalog",
      "hub:event",
      "hub:feature:catalogs:edit:advanced",
    ],
  },
  {
    permission: "hub:event:manage",
    dependencies: ["hub:event:edit"],
  },
];
