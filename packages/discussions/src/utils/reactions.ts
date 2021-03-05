// import { Channel } from '../../channels/channel.entity';
// import { PostReaction } from '@esri/hub-discussions';

import { IChannelDTO, PostReaction } from "../types";

export const canCreateReaction = (
  channel: IChannelDTO,
  value: PostReaction
): boolean => {
  const { allowReaction, allowedReactions } = channel;
  if (allowReaction) {
    if (allowedReactions) {
      return allowedReactions.indexOf(value) > -1;
    }
    return true;
  }
  return false;
};
