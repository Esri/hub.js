import { IGroup, IUser } from "@esri/arcgis-rest-types";
import {
  AclCategory,
  AclSubCategory,
  IChannelAclPermission,
  IChannelAclPermissionDefinition,
  IDiscussionsUser,
  Role,
} from "../types";
import { CANNOT_DISCUSS } from "./constants";
import { isOrgAdmin } from "./platform";

type PermissionsByAclCategoryMap = {
  [key in AclCategory]?: IChannelAclPermission[];
};

enum ChannelAction {
  READ_POSTS = "readPosts",
  WRITE_POSTS = "writePosts",
  MODERATE_CHANNEL = "moderateChannel",
}

export class ChannelPermission {
  private readonly ALLOWED_GROUP_MEMBER_TYPES = ["owner", "admin", "member"];
  private isChannelAclEmpty: boolean;
  private permissionsByCategory: PermissionsByAclCategoryMap;
  private channelCreator: string;

  constructor(channelAcl: IChannelAclPermission[], creator: string) {
    this.isChannelAclEmpty = channelAcl.length === 0;
    this.permissionsByCategory = {};
    this.channelCreator = creator;

    channelAcl.forEach((permission) => {
      const { category } = permission;
      this.permissionsByCategory[category]?.push(permission) ||
        (this.permissionsByCategory[category] = [permission]);
    });
  }

  canPostToChannel(user: IDiscussionsUser): boolean {
    if (this.canAnyUser(ChannelAction.WRITE_POSTS)) {
      return true;
    }

    if (this.isUserUnAuthenticated(user)) {
      return false;
    }

    return (
      this.canAnyAuthenticatedUser(ChannelAction.WRITE_POSTS) ||
      this.canSomeUser(ChannelAction.WRITE_POSTS, user) ||
      this.canSomeUserGroup(ChannelAction.WRITE_POSTS, user) ||
      this.canSomeUserOrg(ChannelAction.WRITE_POSTS, user)
    );
  }

  canCreateChannel(user: IDiscussionsUser): boolean {
    if (this.isUserUnAuthenticated(user) || this.isChannelAclEmpty) {
      return false;
    }

    return (
      this.userCanAddAnonymousToAcl(user) &&
      this.userCanAddUnauthenticatedToAcl(user) &&
      this.userCanAddAllGroupsToAcl(user) &&
      this.userCanAddAllOrgsToAcl(user) &&
      this.userCanAddUsersToAcl(user)
    );
  }

  canModerateChannel(user: IDiscussionsUser): boolean {
    if (this.isUserUnAuthenticated(user)) {
      return false;
    }

    return (
      user.username === this.channelCreator ||
      this.canSomeUser(ChannelAction.MODERATE_CHANNEL, user) ||
      this.canSomeUserGroup(ChannelAction.MODERATE_CHANNEL, user) ||
      this.canSomeUserOrg(ChannelAction.MODERATE_CHANNEL, user)
    );
  }

  canReadChannel(user: IDiscussionsUser): boolean {
    if (this.canAnyUser(ChannelAction.READ_POSTS)) {
      return true;
    }

    if (this.isUserUnAuthenticated(user)) {
      return false;
    }

    return (
      this.canAnyAuthenticatedUser(ChannelAction.READ_POSTS) ||
      this.canSomeUser(ChannelAction.READ_POSTS, user) ||
      this.canSomeUserGroup(ChannelAction.READ_POSTS, user) ||
      this.canSomeUserOrg(ChannelAction.READ_POSTS, user)
    );
  }

  private canAnyUser(action: ChannelAction): boolean {
    const anonymousUserRole =
      this.permissionsByCategory[AclCategory.ANONYMOUS_USER]?.[0].role;

    return channelActionLookup(action).includes(anonymousUserRole);
  }

  private canAnyAuthenticatedUser(action: ChannelAction): boolean {
    const role =
      this.permissionsByCategory[AclCategory.AUTHENTICATED_USER]?.[0].role;
    return channelActionLookup(action).includes(role);
  }

  private canSomeUser(action: ChannelAction, user: IDiscussionsUser) {
    const userPermissions = this.permissionsByCategory[AclCategory.USER] ?? [];
    const username = user.username;

    return userPermissions.some((permission) => {
      const { role, key } = permission;

      return key === username && channelActionLookup(action).includes(role);
    });
  }

  private canSomeUserGroup(action: ChannelAction, user: IDiscussionsUser) {
    const groupAccessControls =
      this.permissionsByCategory[AclCategory.GROUP] ?? [];

    const userGroupsById = this.mapUserGroupsById(user.groups);

    return groupAccessControls.some((permission) => {
      const group = userGroupsById[permission.key];

      if (action === ChannelAction.READ_POSTS) {
        if (!group) {
          return false;
        }
      } else {
        if (!group || !isGroupDiscussable(group)) {
          return false;
        }
      }

      return (
        doesPermissionAllowGroupMemberType(permission, group) &&
        channelActionLookup(action).includes(permission.role)
      );
    });
  }

  private canSomeUserOrg(action: ChannelAction, user: IDiscussionsUser) {
    const orgPermissions = this.permissionsByCategory[AclCategory.ORG] ?? [];

    return orgPermissions.some((permission) => {
      const { key } = permission;
      if (permission.key !== user.orgId) {
        return false;
      }

      return (
        doesPermissionAllowOrgRole(permission, user.role) &&
        channelActionLookup(action).includes(permission.role)
      );
    });
  }

  /**
   * canCreateChannelHelpers
   */
  private userCanAddAnonymousToAcl(user: IDiscussionsUser) {
    if (!this.permissionsByCategory[AclCategory.ANONYMOUS_USER]) {
      return true;
    }
    return isOrgAdmin(user);
  }

  private userCanAddUnauthenticatedToAcl(user: IDiscussionsUser) {
    if (!this.permissionsByCategory[AclCategory.AUTHENTICATED_USER]) {
      return true;
    }
    return isOrgAdmin(user);
  }

  private userCanAddAllGroupsToAcl(user: IDiscussionsUser) {
    const groupPermissions = this.permissionsByCategory[AclCategory.GROUP];
    const userGroupsById = this.mapUserGroupsById(user.groups);

    if (!groupPermissions) {
      return true;
    }

    return groupPermissions.every((permission) => {
      const userGroup = userGroupsById[permission.key];

      return (
        userGroup &&
        this.isMemberTypeAuthorized(userGroup) &&
        isGroupDiscussable(userGroup)
      );
    });
  }

  private userCanAddAllOrgsToAcl(user: IDiscussionsUser) {
    const orgPermissions = this.permissionsByCategory[AclCategory.ORG];

    if (!orgPermissions) {
      return true;
    }

    return (
      isOrgAdmin(user) &&
      this.isEveryPermissionForUserOrg(user.orgId, orgPermissions)
    );
  }

  private isEveryPermissionForUserOrg(
    userOrgId: string,
    orgPermissions: IChannelAclPermissionDefinition[]
  ) {
    return orgPermissions.every((permission) => {
      const { key: orgId } = permission;
      return userOrgId === orgId;
    });
  }

  // for now user permissions are disabled on channel create
  // since users are not notified and cannot opt out
  private userCanAddUsersToAcl(user: IDiscussionsUser) {
    const userPermissions = this.permissionsByCategory[AclCategory.USER];
    return !userPermissions;
  }

  private isUserUnAuthenticated(user: IDiscussionsUser) {
    return user.username === null || user.username === undefined;
  }

  private mapUserGroupsById(groups: IGroup[]) {
    return groups.reduce((accum, userGroup) => {
      accum[userGroup.id] = userGroup;
      return accum;
    }, {} as Record<string, IGroup>);
  }

  private isMemberTypeAuthorized(userGroup: IGroup) {
    const {
      userMembership: { memberType },
    } = userGroup;
    return this.ALLOWED_GROUP_MEMBER_TYPES.includes(memberType);
  }
}

function isGroupDiscussable(userGroup: IGroup): boolean {
  const { typeKeywords = [] } = userGroup;
  return !typeKeywords.includes(CANNOT_DISCUSS);
}

function doesPermissionAllowGroupMemberType(
  permission: IChannelAclPermission,
  group: IGroup
): boolean {
  if (
    permission.category !== AclCategory.GROUP ||
    group.userMembership.memberType === "none"
  ) {
    return false;
  }

  return (
    // group owners and admins can do anything permissioned with SubCategory "member"
    group.userMembership.memberType === "owner" ||
    group.userMembership.memberType === "admin" ||
    permission.subCategory === AclSubCategory.MEMBER
  );
}

function doesPermissionAllowOrgRole(
  permission: IChannelAclPermission,
  orgRole: string
): boolean {
  return (
    permission.category === AclCategory.ORG &&
    (permission.subCategory === AclSubCategory.MEMBER ||
      (permission.subCategory === "admin" && orgRole === "org_admin"))
  );
}

function channelActionLookup(action: ChannelAction): Role[] {
  if (action === ChannelAction.WRITE_POSTS) {
    return [Role.WRITE, Role.READWRITE, Role.MODERATE, Role.MANAGE, Role.OWNER];
  }

  if (action === ChannelAction.MODERATE_CHANNEL) {
    return [Role.MODERATE, Role.MANAGE, Role.OWNER];
  }

  // default to read action
  return [Role.READ, Role.READWRITE, Role.MODERATE, Role.MANAGE, Role.OWNER];
}
