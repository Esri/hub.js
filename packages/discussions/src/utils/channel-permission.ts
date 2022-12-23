import { IGroup } from "@esri/arcgis-rest-types";
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

export class ChannelPermission {
  private readonly ALLOWED_GROUP_MEMBER_TYPES = ["owner", "admin", "member"];
  private readonly ALLOWED_ROLES_FOR_POSTING = [
    Role.WRITE,
    Role.READWRITE,
    Role.MANAGE,
    Role.MODERATE,
    Role.OWNER,
  ];

  private isChannelAclEmpty: boolean;
  private permissionsByCategory: PermissionsByAclCategoryMap;

  constructor(channelAcl: IChannelAclPermission[]) {
    this.isChannelAclEmpty = channelAcl.length === 0;
    this.permissionsByCategory = {};

    channelAcl.forEach((permission) => {
      const { category } = permission;
      this.permissionsByCategory[category]?.push(permission) ||
        (this.permissionsByCategory[category] = [permission]);
    });
  }

  canPostToChannel(user: IDiscussionsUser) {
    if (this.aclAllowsAnyUserToPost()) {
      return true;
    }

    if (!this.isUserLoggedIn(user)) {
      return false;
    }

    return (
      this.aclAllowsAnyAuthenticatedUserToPost() ||
      this.aclAllowsThisUserToPost(user) ||
      this.aclAllowsThisUserToPostByGroups(user) ||
      this.aclAllowsThisUserToPostByOrg(user)
    );
  }

  canCreateChannel(user: IDiscussionsUser) {
    if (!this.isUserLoggedIn(user) || this.isChannelAclEmpty) {
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

  private aclAllowsAnyUserToPost() {
    return this.isAuthorizedToPost(
      this.permissionsByCategory[AclCategory.ANONYMOUS_USER]?.[0].role
    );
  }

  private isAuthorizedToPost(role?: Role) {
    return this.ALLOWED_ROLES_FOR_POSTING.includes(role);
  }

  private isUserLoggedIn(user: IDiscussionsUser) {
    return user.username !== null;
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

  private isGroupDiscussable(userGroup: IGroup) {
    const { typeKeywords = [] } = userGroup;
    return !typeKeywords.includes(CANNOT_DISCUSS);
  }

  private aclAllowsAnyAuthenticatedUserToPost() {
    return this.isAuthorizedToPost(
      this.permissionsByCategory[AclCategory.AUTHENTICATED_USER]?.[0].role
    );
  }

  private aclAllowsThisUserToPost(user: IDiscussionsUser) {
    const userPermissions = this.permissionsByCategory[AclCategory.USER] ?? [];
    const username = user.username;

    return userPermissions.some((permission) => {
      const { role, key } = permission;

      return key === username && this.isAuthorizedToPost(role);
    });
  }

  private aclAllowsThisUserToPostByGroups(user: IDiscussionsUser) {
    const groupPermissions =
      this.permissionsByCategory[AclCategory.GROUP] ?? [];
    const userGroupsById = this.mapUserGroupsById(user.groups);

    return groupPermissions.some((permission) => {
      const userGroup = userGroupsById[permission.key];

      return (
        userGroup &&
        this.isMemberTypeAuthorized(userGroup) &&
        this.isGroupDiscussable(userGroup) &&
        (this.canAnyGroupMemberPost(permission) ||
          this.isGroupAdminAndCanAdminsPost(userGroup, permission))
      );
    });
  }

  private canAnyGroupMemberPost(permission: IChannelAclPermission) {
    const { subCategory, role } = permission;
    return (
      subCategory === AclSubCategory.MEMBER && this.isAuthorizedToPost(role)
    );
  }

  private isGroupAdminAndCanAdminsPost(
    userGroup: IGroup,
    permission: IChannelAclPermission
  ) {
    const { subCategory, role } = permission;
    const {
      userMembership: { memberType },
    } = userGroup;

    const isGroupAdmin = memberType === "admin" || memberType === "owner";

    return (
      isGroupAdmin &&
      subCategory === AclSubCategory.ADMIN &&
      this.isAuthorizedToPost(role)
    );
  }

  private aclAllowsThisUserToPostByOrg(user: IDiscussionsUser) {
    const orgPermissions = this.permissionsByCategory[AclCategory.ORG] ?? [];
    const { orgId: userOrgId } = user;

    return orgPermissions.some((permission) => {
      const { key } = permission;

      return (
        key === userOrgId &&
        (this.canAnyOrgMemberPost(permission) ||
          this.isOrgAdminAndAdminsCanPost(permission, user))
      );
    });
  }

  private canAnyOrgMemberPost(permission: IChannelAclPermission) {
    const { subCategory, role } = permission;
    return (
      subCategory === AclSubCategory.MEMBER && this.isAuthorizedToPost(role)
    );
  }

  private isOrgAdminAndAdminsCanPost(
    permission: IChannelAclPermission,
    user: IDiscussionsUser
  ) {
    const { subCategory, role } = permission;

    return (
      isOrgAdmin(user) &&
      subCategory === AclSubCategory.ADMIN &&
      this.isAuthorizedToPost(role)
    );
  }

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
        this.isGroupDiscussable(userGroup)
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
}
