import { IUser } from "@esri/arcgis-rest-types";
import { IChannelV2, IDiscussionsUser } from "../../types";
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
  channel: IChannelV2,
  user: IUser | IDiscussionsUser = {}
): boolean {
  if (hasOrgAdminDeleteRights(user, channel.orgId)) {
    return true;
  }

  const channelPermission = new ChannelPermission(channel);
  return channelPermission.canModerateChannel(user as IDiscussionsUser);
}
