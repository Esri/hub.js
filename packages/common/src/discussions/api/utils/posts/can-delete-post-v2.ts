import type { IUser } from "@esri/arcgis-rest-portal";
import { IChannel, IDiscussionsUser, IPost } from "../../types";
import { ChannelPermission } from "../channel-permission";
import { hasOrgAdminUpdateRights } from "../portal-privilege";

/**
 * Utility to determine if User has privileges to delete a post
 * @export
 * @param post
 * @param user
 * @param channel
 * @returns {boolean}
 */
export function canDeletePostV2(
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

  const channelPermission = new ChannelPermission(channel);
  return channelPermission.canModerateChannel(user);
}
