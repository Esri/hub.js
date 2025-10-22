import { IGroup, IUser } from "@esri/arcgis-rest-portal";
import { IChannel, IDiscussionsUser } from "../../types";
import { SharingAccess } from "../../enums/sharingAccess";
import { isOrgAdmin } from "../platform";
import { hasOrgAdminUpdateRights } from "../portal-privilege";

const ADMIN_GROUP_ROLES = Object.freeze(["owner", "admin"]);

/**
 * Utility to determine if User has privileges to modify the status of a post
 * @export
 * @deprecated replace with canEditPostStatusV2 for v2 discussions
 * @param channel
 * @param user
 * @returns {boolean}
 */
export function canModifyPostStatus(
  channel: IChannel,
  user: IUser | IDiscussionsUser = {}
): boolean {
  return canEditPostStatus(channel, user);
}

/**
 * Utility to determine if User has privileges to modify the status of a post
 * @export
 * @deprecated replace with canEditPostStatusV2 for v2 discussions
 * @param channel
 * @param user
 * @returns {boolean}
 */
export function canEditPostStatus(
  channel: IChannel,
  user: IUser | IDiscussionsUser = {}
): boolean {
  if (hasOrgAdminUpdateRights(user, channel.orgId)) {
    return true;
  }

  return isAuthorizedToModifyStatusByLegacyPermissions(user, channel);
}

function isAuthorizedToModifyStatusByLegacyPermissions(
  user: IUser | IDiscussionsUser,
  channel: IChannel
): boolean {
  const { username, groups: userGroups = [] } = user;
  const {
    access,
    groups: channelGroups = [],
    orgs: channelOrgs = [],
    creator: channelCreator,
  } = channel;

  if (!username) {
    return false;
  }

  if (channelCreator === username) {
    return true;
  }

  if (access === SharingAccess.PRIVATE) {
    return isAuthorizedToModifyStatusByLegacyGroup(channelGroups, userGroups);
  }

  // public or org access
  return (
    isAuthorizedToModifyStatusByLegacyGroup(channelGroups, userGroups) ||
    isLegacyChannelOrgAdmin(channelOrgs, user)
  );
}

/**
 * Ensure the user is an owner/admin of one of the channel groups
 */
function isAuthorizedToModifyStatusByLegacyGroup(
  channelGroups: string[],
  userGroups: IGroup[]
) {
  return channelGroups.some((channelGroupId: string) => {
    return userGroups.some((group: IGroup) => {
      const {
        id: userGroupId,
        userMembership: { memberType: userMemberType },
      } = group;

      return (
        channelGroupId === userGroupId &&
        ADMIN_GROUP_ROLES.includes(userMemberType)
      );
    });
  });
}

function isLegacyChannelOrgAdmin(
  channelOrgs: string[],
  user: IUser | IDiscussionsUser
): boolean {
  return isOrgAdmin(user) && channelOrgs.includes(user.orgId);
}
