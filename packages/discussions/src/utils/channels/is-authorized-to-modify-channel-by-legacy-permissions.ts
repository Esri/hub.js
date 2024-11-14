import { IUser } from "@esri/arcgis-rest-request";
import { IGroup } from "@esri/arcgis-rest-portal";
import { IChannel, IDiscussionsUser, SharingAccess } from "@esri/hub-common";
import { isOrgAdmin } from "../platform";

const AGO_ADMIN_GROUP_ROLES = Object.freeze(["owner", "admin"]);

/**
 * Utility to determine if User has privileges to modify a channel by legacy channel permissions
 * @param channel
 * @param user
 * @returns {boolean}
 * @internal
 * @hidden
 */
export function isAuthorizedToModifyChannelByLegacyPermissions (
  user: IUser | IDiscussionsUser = {},
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
    isLegacyChannelOrgAdmin(channelOrgs, user)
  );
}

/**
 * Ensure the user is an owner/admin of one of the channel groups
 */
function isAuthorizedToModifyChannelByLegacyGroup (
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
        AGO_ADMIN_GROUP_ROLES.includes(userMemberType)
      );
    });
  });
}

function isLegacyChannelOrgAdmin (
  channelOrgs: string[],
  user: IUser | IDiscussionsUser
): boolean {
  return isOrgAdmin(user) && channelOrgs.includes(user.orgId);
}
