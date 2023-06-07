import { IGroup, IUser } from "@esri/arcgis-rest-types";
import {
  AclCategory,
  AclSubCategory,
  IChannelAclPermission,
  IChannelAclPermissionDefinition,
  IDiscussionsUser,
  Role,
} from "../types";
import { CANNOT_DISCUSS } from "@esri/hub-common";
import { isOrgAdmin } from "./platform";

type PermissionsByAclCategoryMap = {
  [key in AclCategory]?: IChannelAclPermission[];
};

export class ChannelPermission {
  private readonly ALLOWED_GROUP_MEMBER_TYPES = ["owner", "admin", "member"];
  private readonly ADMIN_GROUP_MEMBER_TYPES = ["owner", "admin"];

  private readonly ALLOWED_ROLES_FOR_POSTING = Object.values(Role).filter(
    (role) => role !== Role.READ
  );
  private readonly ALLOWED_ROLES_FOR_MODERATION = [
    Role.MODERATE,
    Role.MANAGE,
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

    if (this.isUserUnAuthenticated(user)) {
      return false;
    }

    return (
      this.aclAllowsAnyAuthenticatedUserToPost() ||
      this.aclAllowsThisUserToPost(user) ||
      this.aclAllowsThisUserToPostByGroups(user) ||
      this.aclAllowsThisUserToPostByOrg(user)
    );
  }

  canModifyPostStatus(user: IDiscussionsUser, channelCreator: string) {
    return this.canModifyChannel(user, channelCreator);
  }

  canCreateChannel(user: IDiscussionsUser) {
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

  canModifyChannel(user: IDiscussionsUser, channelCreator: string) {
    if (this.isUserUnAuthenticated(user)) {
      return false;
    }

    if (user.username === channelCreator) {
      return true;
    }

    return (
      this.aclAllowsThisUserToModifyChannel(user) ||
      this.aclAllowsThisUserToModifyChannelByGroups(user) ||
      this.aclAllowsThisUserToModifyChannelByOrg(user)
    );
  }

  private isAuthorizedToPost(role?: Role) {
    return this.ALLOWED_ROLES_FOR_POSTING.includes(role);
  }

  private isAuthorizedToModerate(role: Role) {
    return this.ALLOWED_ROLES_FOR_MODERATION.includes(role);
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

  private isMemberTypeAdmin(userGroup: IGroup) {
    const {
      userMembership: { memberType },
    } = userGroup;
    return this.ADMIN_GROUP_MEMBER_TYPES.includes(memberType);
  }

  private isGroupDiscussable(userGroup: IGroup) {
    const { typeKeywords = [] } = userGroup;
    return !typeKeywords.includes(CANNOT_DISCUSS);
  }

  /**
   * canPostToChannel helpers
   */
  private aclAllowsAnyUserToPost() {
    const role =
      this.permissionsByCategory[AclCategory.ANONYMOUS_USER]?.[0].role;
    return this.isAuthorizedToPost(role);
  }

  private aclAllowsAnyAuthenticatedUserToPost() {
    const role =
      this.permissionsByCategory[AclCategory.AUTHENTICATED_USER]?.[0].role;
    return this.isAuthorizedToPost(role);
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
          (this.isMemberTypeAdmin(userGroup) && this.canAdminsPost(permission)))
      );
    });
  }

  private canAnyGroupMemberPost(permission: IChannelAclPermission) {
    const { subCategory, role } = permission;
    return (
      subCategory === AclSubCategory.MEMBER && this.isAuthorizedToPost(role)
    );
  }

  private canAdminsPost(permission: IChannelAclPermission) {
    const { subCategory, role } = permission;

    return (
      subCategory === AclSubCategory.ADMIN && this.isAuthorizedToPost(role)
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
          (isOrgAdmin(user) && this.canAdminsPost(permission)))
      );
    });
  }

  private canAnyOrgMemberPost(permission: IChannelAclPermission) {
    const { subCategory, role } = permission;
    return (
      subCategory === AclSubCategory.MEMBER && this.isAuthorizedToPost(role)
    );
  }

  /**
   * canModifyChannel helpers
   */
  private aclAllowsThisUserToModifyChannel(user: IDiscussionsUser) {
    const userPermissions = this.permissionsByCategory[AclCategory.USER] ?? [];
    const username = user.username;

    return userPermissions.some((permission) => {
      const { role, key } = permission;

      return key === username && this.isAuthorizedToModerate(role);
    });
  }

  private aclAllowsThisUserToModifyChannelByGroups(user: IDiscussionsUser) {
    const groupPermissions =
      this.permissionsByCategory[AclCategory.GROUP] ?? [];
    const userGroupsById = this.mapUserGroupsById(user.groups);

    return groupPermissions.some((permission) => {
      const userGroup = userGroupsById[permission.key];

      return (
        userGroup &&
        this.isMemberTypeAuthorized(userGroup) &&
        (this.canAnyGroupMemberModerate(permission) ||
          (this.isMemberTypeAdmin(userGroup) &&
            this.canAdminsModerate(permission)))
      );
    });
  }

  private canAnyGroupMemberModerate(permission: IChannelAclPermission) {
    const { subCategory, role } = permission;
    return (
      subCategory === AclSubCategory.MEMBER && this.isAuthorizedToModerate(role)
    );
  }

  private canAdminsModerate(permission: IChannelAclPermission) {
    const { subCategory, role } = permission;

    return (
      subCategory === AclSubCategory.ADMIN && this.isAuthorizedToModerate(role)
    );
  }

  private aclAllowsThisUserToModifyChannelByOrg(user: IDiscussionsUser) {
    const orgPermissions = this.permissionsByCategory[AclCategory.ORG] ?? [];
    const { orgId: userOrgId } = user;

    return orgPermissions.some((permission) => {
      const { key } = permission;

      return (
        key === userOrgId &&
        (this.canAnyOrgMemberModerate(permission) ||
          (isOrgAdmin(user) && this.canAdminsModerate(permission)))
      );
    });
  }

  private canAnyOrgMemberModerate(permission: IChannelAclPermission) {
    const { subCategory, role } = permission;
    return (
      subCategory === AclSubCategory.MEMBER && this.isAuthorizedToModerate(role)
    );
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
