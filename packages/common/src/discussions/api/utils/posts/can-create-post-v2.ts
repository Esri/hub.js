import type { IUser } from "../../../../rest/types";
import { IChannel, IDiscussionsUser } from "../../types";
import { ChannelPermission } from "../channel-permission";
import { hasOrgAdminUpdateRights } from "../portal-privilege";

/**
 * Utility to determine if User has privileges to create a post in a channel
 * @export
 * @param channel
 * @param user
 * @returns {boolean}
 */
export function canCreatePostV2(
  channel: IChannel,
  user: IUser | IDiscussionsUser = {}
): boolean {
  if (hasOrgAdminUpdateRights(user, channel.orgId)) {
    return true;
  }

  if (!channel.allowPost) {
    return false;
  }

  const channelPermission = new ChannelPermission(channel);
  return channelPermission.canPostToChannel(user as IDiscussionsUser);
}
