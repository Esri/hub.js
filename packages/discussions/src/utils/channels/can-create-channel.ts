import { IGroup, IUser } from "@esri/arcgis-rest-types";
import {
  AclCategory,
  IChannel,
  IChannelAclPermissionDefinition,
  IDiscussionsUser,
  SharingAccess,
} from "../../types";
import { ChannelPermission } from "../channel-permission";
import { CANNOT_DISCUSS } from "@esri/hub-common";
import { isOrgAdmin } from "../platform";

type ILegacyChannelPermissions = Pick<IChannel, "access" | "groups" | "orgs">;

export function canCreateChannel(
  channel: IChannel,
  user: IDiscussionsUser
): boolean {
  const { channelAcl, access, groups, orgs } = channel;

  if (channelAcl) {
    const channelPermission = new ChannelPermission(channelAcl);
    return channelPermission.canCreateChannel(user);
  }

  return isAuthorizedToCreateByLegacyPermissions(user, {
    access,
    groups,
    orgs,
  });
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
      isMemberTypeAuthorized(userGroup) &&
      isGroupDiscussable(userGroup)
    );
  });
}

function isMemberTypeAuthorized(userGroup: IGroup) {
  const {
    userMembership: { memberType },
  } = userGroup;
  return ["owner", "admin", "member"].includes(memberType);
}

function isGroupDiscussable(userGroup: IGroup) {
  const { typeKeywords = [] } = userGroup;
  return !typeKeywords.includes(CANNOT_DISCUSS);
}

function isOrgAdminAndInChannelOrgs(
  user: IDiscussionsUser,
  channelOrgs: string[]
): boolean {
  return isOrgAdmin(user) && channelOrgs.includes(user.orgId);
}
