import { IGroup } from "@esri/arcgis-rest-types";
import {
  IChannel,
  IChannelACL,
  IDiscussionsUser,
  Role,
  SharingAccess,
} from "../../types";
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
  acl: IChannelACL
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

function channelAllowsAnyUserToPost(channelAcl: IChannelACL) {
  return (
    channelAcl.anonymous &&
    ALLOWED_ROLES_FOR_POSTING.includes(channelAcl.anonymous.role)
  );
}

function channelAllowsAnyAuthenticatedUserToPost(channelAcl: IChannelACL) {
  return (
    channelAcl.authenticated &&
    ALLOWED_ROLES_FOR_POSTING.includes(channelAcl.authenticated.role)
  );
}

function channelAllowsThisUserToPost(user: IDiscussionsUser, acl: IChannelACL) {
  // TODO: migrate to userId instead of username
  const { username } = user;

  const userLookup = acl.users || {};
  const userPermission = userLookup[username];

  if (!userPermission) {
    return false;
  }

  return ALLOWED_ROLES_FOR_POSTING.includes(userPermission.role);
}

function channelAllowsPostsByThisUsersGroups(
  user: IDiscussionsUser,
  acl: IChannelACL
) {
  if (!acl.groups) {
    return false;
  }

  return user.groups.some((userGroup: IGroup) => {
    const {
      id: userGroupId,
      userMembership: { memberType: userMemberType },
      typeKeywords,
    } = userGroup;

    const channelGroupPermission = acl.groups[userGroupId];

    return (
      channelGroupPermission &&
      ALLOWED_GROUP_ROLES.includes(userMemberType) &&
      !typeKeywords.includes(CANNOT_DISCUSS)
    );
  });
}

function channelAllowsPostsByThisUsersOrg(
  user: IDiscussionsUser,
  acl: IChannelACL
) {
  if (!acl.orgs) {
    return false;
  }

  const channelOrgPermission = acl.orgs[user.orgId];

  if (!channelOrgPermission) {
    return false;
  }

  return ALLOWED_ROLES_FOR_POSTING.includes(channelOrgPermission.role);
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
