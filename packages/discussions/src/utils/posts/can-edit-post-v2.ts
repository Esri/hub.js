import { IUser } from "@esri/arcgis-rest-types";
import { IChannelV2, IDiscussionsUser, IPost } from "../../types";
import { ChannelPermission } from "../channel-permission";

/**
 * Utility to determine if User has privileges to modify a post
 * @param post
 * @param user
 * @param channel
 * @returns {boolean}
 */
export function canEditPostV2(
  post: IPost,
  user: IUser | IDiscussionsUser = {},
  channel: IChannelV2
): boolean {
  const canReplyOrPost = post.parentId ? channel.allowReply : channel.allowPost;
  const channelPermission = new ChannelPermission(channel);

  return (
    isPostCreator(post, user) &&
    canReplyOrPost &&
    channelPermission.canPostToChannel(user)
  );
}

function isPostCreator(post: IPost, user: IUser | IDiscussionsUser) {
  return !!user.username && post.creator === user.username;
}
