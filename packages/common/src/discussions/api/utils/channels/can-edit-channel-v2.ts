import { IUser } from "@esri/arcgis-rest-portal";
import { IChannel, IDiscussionsUser, IUpdateChannelV2 } from "../../types";
import { ChannelPermission } from "../channel-permission";
import { hasOrgAdminUpdateRights } from "../portal-privilege";

/**
 * Utility to determine if User has privileges to edit a channel
 * @export
 * @param channel
 * @param user
 * @param updateData
 * @returns {boolean}
 */
export function canEditChannelV2(
  channel: IChannel,
  user: IUser | IDiscussionsUser = {},
  updateData: IUpdateChannelV2
): boolean {
  if (hasOrgAdminUpdateRights(user, channel.orgId)) {
    return true;
  }

  const channelPermission = new ChannelPermission(channel);
  return (
    channelPermission.canModerateChannel(user as IDiscussionsUser) &&
    channelPermission.canUpdateProperties(user as IDiscussionsUser, updateData)
  );
}
