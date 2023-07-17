import { IGroup, IUser } from "@esri/arcgis-rest-types";
import { IChannel, IDiscussionsUser, SharingAccess } from "../../types";
import { isOrgAdmin } from "../platform";
import { ChannelPermission } from "../channel-permission";

const ADMIN_GROUP_ROLES = Object.freeze(["owner", "admin"]);

/**
 * Utility to determine if User has privileges to modify the status of a post
 * @param channel
 * @param user
 * @returns {boolean}
 */
export function canModifyPostStatus(
  channel: IChannel,
  user: IUser | IDiscussionsUser = {}
): boolean {
  const { channelAcl, creator } = channel;

  if (channelAcl) {
    const channelPermission = new ChannelPermission(channelAcl, creator);
    return channelPermission.canModerateChannel(user as IDiscussionsUser);
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
    isChannelOrgAdmin(channelOrgs, user)
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

function isChannelOrgAdmin(
  channelOrgs: string[],
  user: IUser | IDiscussionsUser
): boolean {
  return isOrgAdmin(user) && channelOrgs.includes(user.orgId);
}
