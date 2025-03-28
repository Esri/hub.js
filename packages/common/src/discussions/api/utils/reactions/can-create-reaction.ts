import type { IUser } from "@esri/arcgis-rest-portal";
import { PostReaction, IChannel, IDiscussionsUser } from "../../types";
import { canReadChannel } from "../channels/can-read-channel";

/**
 * Utility that determines whether a Channel allows a given PostReaction
 * and whether the User has permissions to create it
 *
 * @export
 * @deprecated replace with canCreateReactionV2 for v2 discussions
 * @param {IChannel} channel
 * @param {PostReaction} value
 * @return {*}  {boolean}
 */
export function canCreateReaction(
  channel: IChannel,
  value: PostReaction,
  user: IUser | IDiscussionsUser = {}
): boolean {
  if (!channelAllowsReaction(channel, value)) {
    return false;
  }

  return canReadChannel(channel, user);
}

function channelAllowsReaction(
  channel: IChannel,
  value: PostReaction
): boolean {
  const { allowReaction, allowedReactions } = channel;
  if (!allowReaction) {
    return false;
  }

  if (allowedReactions) {
    return allowedReactions.includes(value);
  }

  return true;
}
