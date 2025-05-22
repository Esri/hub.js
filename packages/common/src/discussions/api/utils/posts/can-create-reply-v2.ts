import type { IUser } from "@esri/arcgis-rest-portal";
import { IChannel, IDiscussionsUser } from "../../types";
import { ChannelPermission } from "../channel-permission";
import { hasOrgAdminUpdateRights } from "../portal-privilege";

/**
 * Utility to determine if User has privileges to create a reply in a channel
 * @param channel
 * @param user
 * @returns {boolean}
 */
export function canCreateReplyV2(
  channel: IChannel,
  user: IUser | IDiscussionsUser = {}
): boolean {
  if (hasOrgAdminUpdateRights(user, channel.orgId)) {
    return true;
  }

  if (!channel.allowReply) {
    return false;
  }

  const channelPermission = new ChannelPermission(channel);
  return channelPermission.canPostToChannel(user as IDiscussionsUser);
}
