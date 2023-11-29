import { IGroup, IUser } from "@esri/arcgis-rest-types";
import { IChannel, IDiscussionsUser, SharingAccess } from "../../types";
import { ChannelPermission } from "../channel-permission";
import { isOrgAdmin } from "../platform";

const ADMIN_GROUP_ROLES = Object.freeze(["owner", "admin"]);

/**
 * Utility to determine if User has privileges to modify a channel
 * @param channel
 * @param user
 * @returns {boolean}
 */
export function canModifyChannel(
  channel: IChannel,
  user: IUser | IDiscussionsUser = {}
): boolean {
  const { channelAcl, creator } = channel;

  if (channelAcl) {
    const channelPermission = new ChannelPermission(channelAcl);
    return channelPermission.canModerateChannel(user as IDiscussionsUser);
  }

  return isAuthorizedToModifyChannelByLegacyPermissions(user, channel);
}

function isAuthorizedToModifyChannelByLegacyPermissions(
  user: IUser,
  channel: IChannel
): boolean {
  const { username, groups: userGroups = [] } = user;
  const {
    access,
    groups: channelGroups = [],
    orgs: channelOrgs = [],
    creator: channelCreator,
  } = channel;

  // ensure authenticated
  if (!username) {
    return false;
  }

  if (username === channelCreator) {
    return true;
  }

  if (access === SharingAccess.PRIVATE) {
    return isAuthorizedToModifyChannelByLegacyGroup(channelGroups, userGroups);
  }

  // public or org access
  return (
    isAuthorizedToModifyChannelByLegacyGroup(channelGroups, userGroups) ||
    isChannelOrgAdmin(channelOrgs, user)
  );
}

/**
 * Ensure the user is an owner/admin of one of the channel groups
 */
function isAuthorizedToModifyChannelByLegacyGroup(
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
