import { IGroup, IUser } from "@esri/arcgis-rest-types";
import {
  AclCategory,
  IChannel,
  IChannelAclPermissionDefinition,
  IDiscussionsUser,
  SharingAccess,
} from "../../types";
import { CANNOT_DISCUSS } from "../constants";
import { isOrgAdmin, mapPermissionDefinitionsByCategory } from "../platform";

const ALLOWED_GROUP_ROLES = Object.freeze(["owner", "admin", "member"]);

type ILegacyChannelPermissions = Pick<IChannel, "access" | "groups" | "orgs">;

export function canCreateChannel(
  channel: IChannel,
  user: IDiscussionsUser
): boolean {
  const { channelAcl, access, groups, orgs } = channel;

  if (channelAcl) {
    return isAuthorizedToCreateByChannelAcl(user, channelAcl);
  }

  return isAuthorizedToCreateByLegacyPermissions(user, {
    access,
    groups,
    orgs,
  });
}

function isAuthorizedToCreateByChannelAcl(
  user: IDiscussionsUser,
  channelAcl: IChannelAclPermissionDefinition[]
): boolean {
  const { username } = user;

  if (username === null || channelAcl.length === 0) {
    return false;
  }

  const permissions = mapPermissionDefinitionsByCategory(channelAcl);

  return (
    canAllowAnonymous(user, permissions[AclCategory.ANONYMOUS_USER]) &&
    canAllowAuthenticated(user, permissions[AclCategory.AUTHENTICATED_USER]) &&
    canAllowGroups(user, permissions[AclCategory.GROUP]) &&
    canAllowOrgs(user, permissions[AclCategory.ORG]) &&
    canAllowUsers(user, permissions[AclCategory.USER])
  );
}

function canAllowAnonymous(
  user: IDiscussionsUser,
  anonPermissions?: IChannelAclPermissionDefinition[]
) {
  if (!anonPermissions) {
    return true;
  }
  return isOrgAdmin(user);
}

function canAllowAuthenticated(
  user: IDiscussionsUser,
  authenticatedPermissions?: IChannelAclPermissionDefinition[]
) {
  if (!authenticatedPermissions) {
    return true;
  }
  return isOrgAdmin(user);
}

function canAllowGroups(
  user: IDiscussionsUser,
  groupPermissions?: IChannelAclPermissionDefinition[]
) {
  if (!groupPermissions) {
    return true;
  }

  return groupPermissions.every((groupPermission) => {
    const { key: channelGroupId } = groupPermission;

    const userGroup = user.groups.find((group) => group.id === channelGroupId);

    return (
      userGroup &&
      isMemberTypeAuthorized(userGroup.userMembership.memberType) &&
      isGroupDiscussable(userGroup.typeKeywords)
    );
  });
}

function isMemberTypeAuthorized(memberType: string) {
  return ALLOWED_GROUP_ROLES.includes(memberType);
}

function isGroupDiscussable(typeKeywords: string[] = []) {
  return !typeKeywords.includes(CANNOT_DISCUSS);
}

function canAllowOrgs(
  user: IDiscussionsUser,
  orgPermissions?: IChannelAclPermissionDefinition[]
) {
  if (!orgPermissions) {
    return true;
  }
  return (
    isOrgAdmin(user) && isEveryPermissionForUserOrg(user.orgId, orgPermissions)
  );
}

function isEveryPermissionForUserOrg(
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
function canAllowUsers(
  user: IDiscussionsUser,
  userPermissions?: IChannelAclPermissionDefinition[]
) {
  return !userPermissions;
}

// Once ACL usage is enforced, we will remove authorization by legacy permissions
function isAuthorizedToCreateByLegacyPermissions(
  user: IDiscussionsUser,
  channelParams: ILegacyChannelPermissions
): boolean {
  const { username, groups: userGroups } = user;
  const { access, groups: channelGroupIds, orgs: channelOrgs } = channelParams;

  // ensure authenticated
  if (username === null) {
    return false;
  }

  if (access === SharingAccess.PRIVATE) {
    return canAllowGroupsLegacy(userGroups, channelGroupIds);
  }

  // public or org access
  return isOrgAdminAndInChannelOrgs(user, channelOrgs);
}

function canAllowGroupsLegacy(
  userGroups: IGroup[],
  channelGroupIds: string[]
): boolean {
  return channelGroupIds.every((channelGroupId) => {
    const userGroup = userGroups.find((group) => group.id === channelGroupId);

    return (
      userGroup &&
      isMemberTypeAuthorized(userGroup.userMembership.memberType) &&
      isGroupDiscussable(userGroup.typeKeywords)
    );
  });
}

function isOrgAdminAndInChannelOrgs(
  user: IDiscussionsUser,
  channelOrgs: string[]
): boolean {
  return isOrgAdmin(user) && channelOrgs.includes(user.orgId);
}
