import { IChannel } from "../channels";
import { PostReaction } from "../shared/types";

/**
 * Utility that determines whether a Channel allows a given PostReaction
 *
 * @export
 * @param {IChannel} channel
 * @param {PostReaction} value
 * @return {*}  {boolean}
 */
export function canCreateReaction(
  channel: IChannel,
  value: PostReaction
): boolean {
  const { allowReaction, allowedReactions } = channel;
  if (allowReaction) {
    if (allowedReactions) {
      return allowedReactions.indexOf(value) > -1;
    }
    return true;
  }
  return false;
}
