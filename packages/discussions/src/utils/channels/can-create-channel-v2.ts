import { IUser } from "@esri/arcgis-rest-types";
import { IChannelV2, IDiscussionsUser } from "../../types";
import { ChannelPermission } from "../channel-permission";

/**
 * Utility to determine if User has privileges to create a channel with the defined permissions
 * @export
 * @param channel
 * @param user
 * @returns {boolean}
 */
export function canCreateChannelV2(
  channel: IChannelV2,
  user: IUser | IDiscussionsUser = {}
): boolean {
  const channelPermission = new ChannelPermission(channel);
  return channelPermission.canCreateChannel(user as IDiscussionsUser);
}
