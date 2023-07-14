import { IGroup, IUser } from "@esri/arcgis-rest-types";
import { IChannel, IDiscussionsUser, SharingAccess } from "../../types";
import { ChannelPermission } from "../channel-permission";
import { CANNOT_DISCUSS } from "../constants";
import { isOrgAdmin } from "../platform";

type ILegacyChannelPermissions = Pick<IChannel, "access" | "groups" | "orgs">;

/**
 * Utility to determine if User has privileges to create a channel with the defined permissions
 * @param channel
 * @param user
 * @returns {boolean}
 */
export function canCreateChannel(
  channel: IChannel,
  user: IUser | IDiscussionsUser = {}
): boolean {
  const { channelAcl, access, groups, orgs, creator } = channel;

  if (channelAcl) {
    const channelPermission = new ChannelPermission(channelAcl, creator);
    return channelPermission.canCreateChannel(user as IDiscussionsUser);
  }

  return isAuthorizedToCreateByLegacyPermissions(user, {
    access,
    groups,
    orgs,
  });
}

// Once ACL usage is enforced, we will remove authorization by legacy permissions
function isAuthorizedToCreateByLegacyPermissions(
  user: IUser | IDiscussionsUser,
  channelParams: ILegacyChannelPermissions
): boolean {
  const { username, groups: userGroups = [] } = user;
  const {
    access,
    groups: channelGroupIds = [],
    orgs: channelOrgs,
  } = channelParams;

  // ensure authenticated
  if (!username) {
    return false;
  }

  if (access === SharingAccess.PRIVATE) {
    return canAllowGroupsLegacy(userGroups, channelGroupIds);
  }

  // public or org access
  return (
    canAllowGroupsLegacy(userGroups, channelGroupIds) &&
    isChannelOrgAdmin(user, channelOrgs)
  );
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

function isChannelOrgAdmin(
  user: IUser | IDiscussionsUser,
  channelOrgs: string[]
): boolean {
  return isOrgAdmin(user) && channelOrgs.includes(user.orgId);
}
