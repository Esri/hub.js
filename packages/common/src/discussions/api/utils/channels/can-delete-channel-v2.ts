import { IUser } from "@esri/arcgis-rest-portal";
import { IChannel, IDiscussionsUser } from "../../types";
import { ChannelPermission } from "../channel-permission";
import { hasOrgAdminDeleteRights } from "../portal-privilege";

/**
 * Utility to determine if User has privileges to delete a channel
 * @export
 * @param channel
 * @param user
 * @returns {boolean}
 */
export function canDeleteChannelV2(
  channel: IChannel,
  user: IUser | IDiscussionsUser = {}
): boolean {
  if (hasOrgAdminDeleteRights(user, channel.orgId)) {
    return true;
  }

  const channelPermission = new ChannelPermission(channel);
  return channelPermission.canModerateChannel(user as IDiscussionsUser);
}
