import { IGroup } from "@esri/arcgis-rest-types";
import {
  AclCategory,
  AclSubCategory,
  IAclGroup,
  IAclPermission,
  IChannel,
  IChannelAclObject,
  IChannelAclPermission,
  IDiscussionsUser,
  Role,
  SharingAccess,
} from "../../types";
import { CANNOT_DISCUSS } from "../constants";
import { mapPermissionsByCategory, mapUserGroupsById } from "../platform";

const ALLOWED_GROUP_ROLES = Object.freeze(["owner", "admin", "member"]);

const ALLOWED_ROLES_FOR_POSTING = Object.freeze([
  Role.WRITE,
  Role.READWRITE,
  Role.MANAGE,
  Role.MODERATE,
  Role.OWNER,
]);

type ILegacyChannelPermissions = Pick<
  IChannel,
  "groups" | "orgs" | "access" | "allowAnonymous"
>;

export function canPostToChannel(
  channel: IChannel,
  user: IDiscussionsUser
): boolean {
  const { acl, channelAcl, access, groups, orgs, allowAnonymous } = channel;

  if (acl) {
    return isAuthorizedToPostByAcl(user, acl);
  }

  if (channelAcl) {
    return isAuthorizedToPostByChannelAcl(user, channelAcl);
  }

  // Once channelAcl usage is enforced, we will remove authorization by legacy permissions
  return isAuthorizedToPostByLegacyPermissions(user, {
    access,
    groups,
    orgs,
    allowAnonymous,
  });
}

function isAuthorizedToPostByChannelAcl(
  user: IDiscussionsUser,
  channelAcl: IChannelAclPermission[]
): boolean {
  const permissions = mapPermissionsByCategory(channelAcl);

  if (canAnyUserPost(permissions[AclCategory.ANONYMOUS_USER])) {
    return true;
  }

  if (user.username === null) {
    return false;
  }

  return (
    canAnyAuthenticatedUserPost(permissions[AclCategory.AUTHENTICATED_USER]) ||
    canThisUserPost(user, permissions[AclCategory.USER]) ||
    isAllowedToPostByUsersGroups(user, permissions[AclCategory.GROUP]) ||
    isAllowedToPostByUsersOrg(user, permissions[AclCategory.ORG])
  );
}

function canAnyUserPost(channelAcl?: IChannelAclPermission[]) {
  return isAuthorizedToPost(channelAcl?.[0].role);
}

function isAuthorizedToPost(role?: Role) {
  return ALLOWED_ROLES_FOR_POSTING.includes(role);
}

function canAnyAuthenticatedUserPost(channelAcl?: IChannelAclPermission[]) {
  return isAuthorizedToPost(channelAcl?.[0].role);
}

function canThisUserPost(
  user: IDiscussionsUser,
  channelAcl: IChannelAclPermission[] = []
) {
  const username = user.username;

  return channelAcl.some((permission) => {
    const { role, key } = permission;

    return key === username && isAuthorizedToPost(role);
  });
}

function isAllowedToPostByUsersGroups(
  user: IDiscussionsUser,
  channelAcl: IChannelAclPermission[] = []
) {
  const userGroupsById = mapUserGroupsById(user.groups);

  return channelAcl.some((permission) => {
    const userGroup = userGroupsById[permission.key];

    return (
      userGroup &&
      isValidMemberType(userGroup) &&
      isGroupDiscussable(userGroup) &&
      (canAnyGroupMemberPost(permission) ||
        isGroupAdminAndCanAdminsPost(userGroup, permission))
    );
  });
}

function isValidMemberType(userGroup: IGroup) {
  const {
    userMembership: { memberType },
  } = userGroup;
  return ALLOWED_GROUP_ROLES.includes(memberType);
}

function isGroupDiscussable(userGroup: IGroup) {
  const { typeKeywords = [] } = userGroup;
  return !typeKeywords.includes(CANNOT_DISCUSS);
}

function canAnyGroupMemberPost(permission: IChannelAclPermission) {
  const { subCategory, role } = permission;
  return subCategory === AclSubCategory.MEMBER && isAuthorizedToPost(role);
}

function isGroupAdminAndCanAdminsPost(
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
    isAuthorizedToPost(role)
  );
}

function isAllowedToPostByUsersOrg(
  user: IDiscussionsUser,
  channelAcl: IChannelAclPermission[] = []
) {
  const { orgId: userOrgId } = user;

  return channelAcl.some((permission) => {
    const { key } = permission;

    return (
      key === userOrgId &&
      (canAnyOrgMemberPost(permission) ||
        isOrgAdminAndAdminsCanPost(permission, user))
    );
  });
}

function canAnyOrgMemberPost(permission: IChannelAclPermission) {
  const { subCategory, role } = permission;
  return subCategory === AclSubCategory.MEMBER && isAuthorizedToPost(role);
}

function isOrgAdminAndAdminsCanPost(
  permission: IChannelAclPermission,
  user: IDiscussionsUser
) {
  const { subCategory, role } = permission;
  const isOrgAdmin = user.role === "org_admin";

  return (
    isOrgAdmin &&
    subCategory === AclSubCategory.ADMIN &&
    isAuthorizedToPost(role)
  );
}

function isAuthorizedToPostByAcl(
  user: IDiscussionsUser,
  acl: IChannelAclObject
): boolean {
  if (channelAllowsAnyUserToPostAcl(acl)) {
    return true;
  }

  if (user.username === null) {
    return false;
  }

  return (
    channelAllowsAnyAuthenticatedUserToPostAcl(acl) ||
    channelAllowsThisUserToPostAcl(user, acl) ||
    channelAllowsPostsByThisUsersGroupsAcl(user, acl) ||
    channelAllowsPostsByThisUsersOrgAcl(user, acl)
  );
}

function channelAllowsAnyUserToPostAcl(acl: IChannelAclObject) {
  return isAuthorizedAcl(ALLOWED_ROLES_FOR_POSTING, acl.anonymous);
}

function channelAllowsAnyAuthenticatedUserToPostAcl(acl: IChannelAclObject) {
  return isAuthorizedAcl(ALLOWED_ROLES_FOR_POSTING, acl.authenticated);
}

function channelAllowsThisUserToPostAcl(
  user: IDiscussionsUser,
  acl: IChannelAclObject
) {
  // TODO: migrate to userId instead of username
  const { username } = user;

  const userLookup = acl.users || {};
  const userPermission = userLookup[username];

  return isAuthorizedAcl(ALLOWED_ROLES_FOR_POSTING, userPermission);
}

function channelAllowsPostsByThisUsersGroupsAcl(
  user: IDiscussionsUser,
  acl: IChannelAclObject
) {
  if (!acl.groups) {
    return false;
  }

  return user.groups.some((userGroup: IGroup) => {
    const {
      id: userGroupId,
      userMembership: { memberType: groupMemberType },
      typeKeywords,
    } = userGroup;

    const aclGroup = acl.groups[userGroupId];

    if (!aclGroup || typeKeywords.includes(CANNOT_DISCUSS)) {
      return false;
    }

    if (canGroupMembersPostAcl(aclGroup)) {
      return true;
    }

    return (
      (groupMemberType === "admin" || groupMemberType === "owner") &&
      canGroupAdminsPost(aclGroup)
    );
  });
}

function canGroupMembersPostAcl(aclGroup: IAclGroup): boolean {
  return isAuthorizedAcl(ALLOWED_ROLES_FOR_POSTING, aclGroup.member);
}

function canGroupAdminsPost(aclGroup: IAclGroup): boolean {
  return isAuthorizedAcl(ALLOWED_ROLES_FOR_POSTING, aclGroup.admin);
}

function isAuthorizedAcl(
  allowedRoles: readonly Role[],
  permission?: IAclPermission
): boolean {
  return permission && allowedRoles.includes(permission.role);
}

function channelAllowsPostsByThisUsersOrgAcl(
  user: IDiscussionsUser,
  acl: IChannelAclObject
) {
  const { orgId, role: orgRole } = user;

  if (!acl.orgs) {
    return false;
  }

  const channelOrgPermission = acl.orgs[orgId];

  if (!channelOrgPermission) {
    return false;
  }

  return (
    (orgRole === "org_admin" &&
      isAuthorizedAcl(ALLOWED_ROLES_FOR_POSTING, channelOrgPermission.admin)) ||
    isAuthorizedAcl(ALLOWED_ROLES_FOR_POSTING, channelOrgPermission.member)
  );
}

function isAuthorizedToPostByLegacyPermissions(
  user: IDiscussionsUser,
  channelParams: ILegacyChannelPermissions
): boolean {
  const { username, groups: userGroups, orgId: userOrgId } = user;
  const { allowAnonymous, access, groups, orgs } = channelParams;

  // order is important here
  if (allowAnonymous === true) {
    return true;
  }

  if (username === null) {
    return false;
  }

  if (access === SharingAccess.PUBLIC) {
    return true;
  }

  if (access === SharingAccess.PRIVATE) {
    return isAuthorizedToPostByLegacyGroup(groups, userGroups);
  }

  if (access === SharingAccess.ORG) {
    return orgs.includes(userOrgId);
  }

  return false;
}

function isAuthorizedToPostByLegacyGroup(
  channelGroups: string[] = [],
  userGroups: IGroup[] = []
) {
  return channelGroups.some((channelGroupId: string) => {
    return userGroups.some((group: IGroup) => {
      const {
        id: userGroupId,
        userMembership: { memberType: userMemberType },
        typeKeywords,
      } = group;

      return (
        channelGroupId === userGroupId &&
        ALLOWED_GROUP_ROLES.includes(userMemberType) &&
        !typeKeywords.includes(CANNOT_DISCUSS)
      );
    });
  });
}
