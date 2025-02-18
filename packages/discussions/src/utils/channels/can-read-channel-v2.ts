import { IUser } from "@esri/arcgis-rest-auth";
import { IChannelV2, IDiscussionsUser } from "../../types";
import { ChannelPermission } from "../channel-permission";
import { hasOrgAdminViewRights } from "../portal-privilege";

/**
 * Utility to determine if User can view channel posts and channel attributes
 *
 * @export
 * @param {IChannelV2} channel
 * @param {IUser} user
 * @return {*}  {boolean}
 */
export function canReadChannelV2(
  channel: IChannelV2,
  user: IUser | IDiscussionsUser = {}
): boolean {
  if (hasOrgAdminViewRights(user, channel.orgId)) {
    return true;
  }

  const channelPermission = new ChannelPermission(channel);
  return channelPermission.canReadChannel(user);
}
