import { IUser } from "@esri/arcgis-rest-auth";
import { PostReaction, IChannel, IDiscussionsUser } from "../../types";
import { canReadChannelV2 } from "../channels/can-read-channel-v2";

/**
 * Utility that determines whether a Channel allows a given PostReaction
 * and whether the User has permissions to create it
 *
 * @export
 * @param {IChannel} channel
 * @param {PostReaction} value
 * @return {*}  {boolean}
 */
export function canCreateReactionV2(
  channel: IChannel,
  value: PostReaction,
  user: IUser | IDiscussionsUser = {}
): boolean {
  if (!channelAllowsReaction(channel, value)) {
    return false;
  }

  return canReadChannelV2(channel, user);
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
