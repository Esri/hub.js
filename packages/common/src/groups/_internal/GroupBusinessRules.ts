import { IPermissionPolicy } from "../../permissions";

/**
 * Group Permission Policies
 * These define the requirements any user must meet to perform related actions
 * @private
 */
export const GroupPermissions = [
  "hub:group",
  "hub:group:create",
  "hub:group:create:view",
  "hub:group:create:edit",
  "hub:group:delete",
  "hub:group:edit",
  "hub:group:view",
  "hub:group:owner",
  "hub:group:canChangeAccess",
  "hub:group:canAssignMembers",
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
  // general permission to create a group
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
  // permission to create a view group
  {
    permission: "hub:group:create:view",
    dependencies: ["hub:group:create"],
  },
  // permission to create an edit group
  {
    permission: "hub:group:create:edit",
    dependencies: ["hub:group:create"],
    privileges: ["portal:admin:createUpdateCapableGroup"],
  },
  {
    permission: "hub:group:view",
    dependencies: ["hub:group"],
  },
  // permission to update a group's metadata
  {
    permission: "hub:group:edit",
    dependencies: ["hub:group"],
    authenticated: true,
    assertions: [
      // if the user is not a group admin, they must
      // have the portal:admin:updateGroups privilege
      {
        conditions: [
          {
            property: "context:currentUser",
            type: "is-not-group-admin",
            value: "entity:id",
          },
        ],
        property: "context:currentUser.privileges",
        type: "contains",
        value: ["portal:admin:updateGroups"],
      },
      // if the user does not have the portal:admin:updateGroups
      // privilege, they must be a group admin
      {
        conditions: [
          {
            property: "context:currentUser.privileges",
            type: "without",
            value: ["portal:admin:updateGroups"],
          },
        ],
        property: "context:currentUser",
        type: "is-group-admin",
        value: "entity:id",
      },
    ],
  },
  // permission to delete a group
  {
    permission: "hub:group:delete",
    dependencies: ["hub:group"],
    authenticated: true,
    assertions: [
      // if the user is not the group owner, they must
      // have the portal:admin:deleteGroups priv
      {
        conditions: [
          {
            property: "context:currentUser",
            type: "is-not-group-owner",
            value: "entity:id",
          },
        ],
        property: "context:currentUser.privileges",
        type: "contains",
        value: ["portal:admin:deleteGroups"],
      },
      // if the user does not have the portal:admin:deleteGroups
      // priv, they must be the group owner
      {
        conditions: [
          {
            property: "context:currentUser.privileges",
            type: "without",
            value: ["portal:admin:deleteGroups"],
          },
        ],
        property: "context:currentUser",
        type: "is-group-owner",
        value: "entity:id",
      },
    ],
  },
  // permission to manage a group (via workspace)
  // note: pane actions are further gated individually
  {
    permission: "hub:group:manage",
    assertions: [
      // if the user is not a group admin,
      // they must have one of the necessary
      // privileges
      {
        conditions: [
          {
            property: "context:currentUser",
            type: "is-not-group-admin",
            value: "entity:id",
          },
        ],
        property: "context:currentUser.privileges",
        type: "contains-some",
        value: [
          "portal:admin:updateGroups",
          "portal:admin:deleteGroups",
          "portal:admin:assignToGroups",
          "portal:admin:shareToGroup",
        ],
      },
      // if the user does not have one of the
      // necessary privileges, they must be a
      // group admin
      {
        conditions: [
          {
            property: "context:currentUser.privileges",
            type: "without",
            value: [
              "portal:admin:updateGroups",
              "portal:admin:deleteGroups",
              "portal:admin:assignToGroups",
              "portal:admin:shareToGroup",
            ],
          },
        ],
        property: "context:currentUser",
        type: "is-group-admin",
        value: "entity:id",
      },
    ],
  },
  {
    permission: "hub:group:owner",
    dependencies: ["hub:group"],
    authenticated: true,
    entityOwner: true,
  },
  {
    permission: "hub:group:canChangeAccess",
    dependencies: ["hub:group:edit"],
  },
  // permission to add/remove group members,
  // and update member role
  {
    permission: "hub:group:canAssignMembers",
    dependencies: ["hub:group"],
    authenticated: true,
    assertions: [
      // if the user is not a group admin, they must
      // have the portal:admin:assignToGroups privilege
      {
        conditions: [
          {
            property: "context:currentUser",
            type: "is-not-group-admin",
            value: "entity:id",
          },
        ],
        property: "context:currentUser.privileges",
        type: "contains",
        value: ["portal:admin:assignToGroups"],
      },
      // if the user does not have the portal:admin:assignToGroups
      // privilege, they must be a group admin
      {
        conditions: [
          {
            property: "context:currentUser.privileges",
            type: "without",
            value: ["portal:admin:assignToGroups"],
          },
        ],
        property: "context:currentUser",
        type: "is-group-admin",
        value: "entity:id",
      },
    ],
  },
  {
    permission: "hub:group:workspace",
    dependencies: ["hub:feature:workspace", "hub:group:manage"],
  },
  {
    permission: "hub:group:workspace:overview",
    availability: ["alpha"],
    dependencies: ["hub:group:workspace"],
  },
  {
    permission: "hub:group:workspace:details",
    dependencies: ["hub:group:workspace"],
  },
  {
    permission: "hub:group:workspace:discussion",
    dependencies: ["hub:group:workspace"],
  },
  {
    permission: "hub:group:workspace:settings",
    dependencies: ["hub:group:workspace"],
  },
  {
    permission: "hub:group:workspace:content",
    dependencies: ["hub:group:workspace"],
  },
  {
    permission: "hub:group:workspace:members",
    dependencies: ["hub:group:workspace"],
  },
  // permission to check if you can add/remove content from groups
  {
    permission: "hub:group:shareContent",
    dependencies: ["hub:group"],
    authenticated: true,
    privileges: ["portal:user:shareToGroup"],
    assertions: [
      // If user is not a group member (owner, manager, or member),
      // they must have the portal:admin:shareToGroup privilege
      {
        conditions: [
          {
            property: "context:currentUser",
            type: "is-not-group-member",
            value: "entity:id",
          },
        ],
        property: "context:currentUser.privileges",
        type: "contains",
        value: ["portal:admin:shareToGroup"],
      },
      // If the group is not view only, any group member
      // can share content
      {
        conditions: [
          {
            property: "entity:isViewOnly",
            type: "eq",
            value: false,
          },
          {
            property: "context:currentUser.privileges",
            type: "without",
            value: ["portal:admin:shareToGroup"],
          },
        ],
        property: "context:currentUser",
        type: "is-group-member",
        value: "entity:id",
      },

      // if the group is view only, only group admins can
      // share content
      {
        conditions: [
          {
            property: "entity:isViewOnly",
            type: "eq",
            value: true,
          },
          {
            property: "context:currentUser.privileges",
            type: "without",
            value: ["portal:admin:shareToGroup"],
          },
        ],
        property: "context:currentUser",
        type: "is-group-admin",
        value: "entity:id",
      },
    ],
  },
];
