import type { IUser } from "@esri/arcgis-rest-portal";
import { IChannel, IDiscussionsUser } from "../../types";
import { ChannelPermission } from "../channel-permission";

/**
 * Utility to determine if User has privileges to create a channel with the defined permissions
 * @export
 * @param channel
 * @param user
 * @returns {boolean}
 */
export function canCreateChannelV2(
  channel: IChannel,
  user: IUser | IDiscussionsUser = {}
): boolean {
  const channelPermission = new ChannelPermission(channel);
  return channelPermission.canCreateChannel(user as IDiscussionsUser);
}
