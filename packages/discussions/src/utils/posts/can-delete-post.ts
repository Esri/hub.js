import { IUser } from "@esri/arcgis-rest-types";
import { IChannel, IDiscussionsUser, IPost } from "../../types";
import { ChannelPermission } from "../channel-permission";
import { isOrgAdminInOrg, isUserInOrg, userHasPrivileges } from "../platform";

/**
 * Utility to determine if User has privileges to delete a post
 * @param post
 * @param user
 * @param channel
 * @returns {boolean}
 */
export function canDeletePost(
  post: IPost,
  channel: IChannel,
  user: IUser | IDiscussionsUser = {}
): boolean {
  return isPostCreator(post, user) || isChannelModerator(channel, user);
}

function isPostCreator(post: IPost, user: IUser | IDiscussionsUser) {
  return !!user.username && post.creator === user.username;
}

function isChannelModerator(
  channel: IChannel,
  user: IUser | IDiscussionsUser
): boolean {
  if (hasOrgAdminUpdateRights(user, channel.orgId)) {
    return true;
  }

  if (!channel.channelAcl) {
    return false;
  }

  const channelPermission = new ChannelPermission(channel);
  return channelPermission.canModerateChannel(user);
}

function hasOrgAdminUpdateRights(
  user: IUser | IDiscussionsUser = {},
  orgId: string
) {
  return (
    isOrgAdminInOrg(user, orgId) ||
    (isUserInOrg(user, orgId) &&
      userHasPrivileges(user, [
        "portal:admin:viewItems",
        "portal:admin:updateItems",
      ]))
  );
}
