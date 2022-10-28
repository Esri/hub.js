import { IGroup } from "@esri/arcgis-rest-types";
import {
  IAclGroup,
  IAclPermission,
  IChannel,
  IChannelAcl,
} from "../../channels";
import { IDiscussionsUser, Role, SharingAccess } from "../../types";
import { CANNOT_DISCUSS } from "../constants";

const ALLOWED_GROUP_ROLES = Object.freeze(["owner", "admin", "member"]);

const ALLOWED_ROLES_FOR_POSTING = Object.freeze([
  Role.WRITE,
  Role.READWRITE,
  Role.MANAGE,
  Role.MODERATE,
  Role.OWNER,
]);

interface ILegacyChannelPermissions
  extends Pick<IChannel, "groups" | "orgs" | "access" | "allowAnonymous"> {}

export function canPostToChannel(
  channel: IChannel,
  user: IDiscussionsUser
): boolean {
  const { acl, access, groups, orgs, allowAnonymous } = channel;

  if (acl) {
    return isAuthorizedToPostByAcl(user, acl);
  }

  // Once ACL usage is enforce, we will remove authorization by legacy permissions
  return isAuthorizedToPostByLegacyPermissions(user, {
    access,
    groups,
    orgs,
    allowAnonymous,
  });
}

function isAuthorizedToPostByAcl(
  user: IDiscussionsUser,
  acl: IChannelAcl
): boolean {
  if (channelAllowsAnyUserToPost(acl)) {
    return true;
  }

  if (user.username === null) {
    return false;
  }

  return (
    channelAllowsAnyAuthenticatedUserToPost(acl) ||
    channelAllowsThisUserToPost(user, acl) ||
    channelAllowsPostsByThisUsersGroups(user, acl) ||
    channelAllowsPostsByThisUsersOrg(user, acl)
  );
}

function channelAllowsAnyUserToPost(channelAcl: IChannelAcl) {
  return isAuthorized(ALLOWED_ROLES_FOR_POSTING, channelAcl.anonymous);
}

function channelAllowsAnyAuthenticatedUserToPost(channelAcl: IChannelAcl) {
  return isAuthorized(ALLOWED_ROLES_FOR_POSTING, channelAcl.authenticated);
}

function channelAllowsThisUserToPost(user: IDiscussionsUser, acl: IChannelAcl) {
  // TODO: migrate to userId instead of username
  const { username } = user;

  const userLookup = acl.users || {};
  const userPermission = userLookup[username];

  return isAuthorized(ALLOWED_ROLES_FOR_POSTING, userPermission);
}

function channelAllowsPostsByThisUsersGroups(
  user: IDiscussionsUser,
  acl: IChannelAcl
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

    if (canGroupMembersPost(aclGroup)) {
      return true;
    }

    return (
      (groupMemberType === "admin" || groupMemberType === "owner") &&
      canGroupAdminsPost(aclGroup)
    );
  });
}

function canGroupMembersPost(aclGroup: IAclGroup): boolean {
  return isAuthorized(ALLOWED_ROLES_FOR_POSTING, aclGroup.member);
}

function canGroupAdminsPost(aclGroup: IAclGroup): boolean {
  return isAuthorized(ALLOWED_ROLES_FOR_POSTING, aclGroup.admin);
}

function isAuthorized(
  allowedRoles: readonly Role[],
  permission?: IAclPermission
): boolean {
  return permission && allowedRoles.includes(permission.role);
}

function channelAllowsPostsByThisUsersOrg(
  user: IDiscussionsUser,
  acl: IChannelAcl
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
      isAuthorized(ALLOWED_ROLES_FOR_POSTING, channelOrgPermission.admin)) ||
    isAuthorized(ALLOWED_ROLES_FOR_POSTING, channelOrgPermission.member)
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
