import type { IUser } from "@esri/arcgis-rest-types";
import { IChannel, IDiscussionsUser } from "../../types";
import { ChannelPermission } from "../channel-permission";
import { hasOrgAdminUpdateRights } from "../portal-privilege";

/**
 * Utility to determine if User has privileges to modify the status of a post
 * @param channel
 * @param user
 * @returns {boolean}
 */
export function canEditPostStatusV2(
  channel: IChannel,
  user: IUser | IDiscussionsUser = {}
): boolean {
  if (hasOrgAdminUpdateRights(user, channel.orgId)) {
    return true;
  }

  const channelPermission = new ChannelPermission(channel);
  return channelPermission.canModerateChannel(user as IDiscussionsUser);
}
