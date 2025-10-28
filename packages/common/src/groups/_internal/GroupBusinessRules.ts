import { IPermissionPolicy } from "../../permissions/types/IPermissionPolicy";

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
    // Group Admin's can message members of a group
    permission: "hub:group:messaging",
    dependencies: ["hub:group"],
    authenticated: true,
    licenses: ["hub-premium"],
    environments: ["qaext"],
    availability: ["alpha"],
    services: ["portal"],
    assertions: [
      {
        property: "context:currentUser",
        type: "is-group-admin",
        value: "entity:id",
      },
    ],
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
  {
    // Group Admin's can message members of a group on the view members pane
    permission: "hub:group:view:messaging",
    dependencies: ["hub:group:view"],
    authenticated: true,
    licenses: ["hub-premium"],
    environments: ["qaext"],
    availability: ["alpha"],
    assertions: [
      {
        property: "context:currentUser",
        type: "is-group-admin",
        value: "entity:id",
      },
    ],
  },
  // permission to update a group's metadata
  {
    permission: "hub:group:edit",
    dependencies: ["hub:group"],
    authenticated: true,
    assertions: [
      {
        // user is a group manager (owner or admin)
        property: "entity:userMembership.memberType",
        type: "included-in",
        value: ["owner", "admin"],
        conditions: [
          // Only use this check if user is owner or admin
          // This is a weird construct, but it's needed to
          // implement "OR" with the next assertion
          {
            property: "entity:userMembership.memberType",
            type: "included-in",
            value: ["owner", "admin"],
          },
        ],
      },
      // user is a member AND entity:orgId === context:portal.id AND user has portal:admin:updateGroups
      {
        // Dont run this check unless user is member or none
        // and has updateGroups privilege
        conditions: [
          // user is not owner or admin
          {
            property: "entity:userMembership.memberType",
            type: "included-in",
            value: ["member", "none"],
          },
          // user has admin priv
          {
            property: "context:currentUser.privileges",
            type: "contains",
            value: ["portal:admin:updateGroups"],
          },
        ],
        // then check if the group belongs to the user's org
        property: "context:portal.id",
        type: "eq",
        value: "entity:orgId",
      },
    ],
  },

  // permission to delete a group
  {
    permission: "hub:group:delete",
    dependencies: ["hub:group"],
    authenticated: true,
    assertions: [
      // if the user is not a group admin (owner or manager),
      // they must have the portal:admin:deleteGroups priv
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
        value: ["portal:admin:deleteGroups"],
      },
      // if the user does not have the portal:admin:deleteGroups
      // priv, they must be the group admin (owner or manager)
      {
        conditions: [
          {
            property: "context:currentUser.privileges",
            type: "without",
            value: ["portal:admin:deleteGroups"],
          },
        ],
        property: "context:currentUser",
        type: "is-group-admin",
        value: "entity:id",
      },
    ],
  },
  // permission to manage a group (via workspace)
  // note: pane actions are further gated individually
  {
    permission: "hub:group:manage",
    dependencies: ["hub:group:edit"],
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
    permission: "hub:group:workspace:settings",
    dependencies: ["hub:group:workspace"],
  },
  {
    permission: "hub:group:settings:discussions",
    services: ["discussions"],
    dependencies: ["hub:group:workspace:settings"],
    licenses: ["hub-basic", "hub-premium"],
  },
  {
    permission: "hub:group:workspace:content",
    dependencies: ["hub:group:workspace"],
  },
  {
    permission: "hub:group:workspace:members",
    dependencies: ["hub:group:workspace"],
  },
  {
    // Group Admin's can message members of a group
    permission: "hub:group:workspace:members:messaging",
    dependencies: ["hub:group:workspace:members"],
    authenticated: true,
    licenses: ["hub-premium"],
    assertions: [
      {
        property: "context:currentUser",
        type: "is-group-admin",
        value: "entity:id",
      },
    ],
  },
  {
    permission: "hub:group:workspace:events",
    services: ["events"],
    dependencies: ["hub:group:workspace"],
    licenses: ["hub-premium"],
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
