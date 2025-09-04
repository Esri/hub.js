import { IUser } from "@esri/arcgis-rest-request";
import { IChannel, IDiscussionsUser } from "../../types";
import { ChannelPermission } from "../channel-permission";

/**
 * Utility to determine if User is a moderator of a channel
 */
export function canModerateChannelV2(
  channel: IChannel,
  user: IUser | IDiscussionsUser = {}
): boolean {
  const channelPermission = new ChannelPermission(channel);
  return channelPermission.canModerateChannel(user as IDiscussionsUser);
}
