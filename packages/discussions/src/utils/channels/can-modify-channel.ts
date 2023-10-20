import { IUser } from "@esri/arcgis-rest-types";
import { IChannel, IDiscussionsUser, SharingAccess } from "../../types";
import { ChannelPermission } from "../channel-permission";

const ADMIN_GROUP_ROLES = Object.freeze(["owner", "admin"]);

/**
 * Utility to determine if User has privileges to modify a channel
 * @param channel
 * @param user
 * @returns {boolean}
 */
export function canModifyChannel(
  channel: IChannel,
  user: IUser | IDiscussionsUser = {}
): boolean {
  const { channelAcl } = channel;

  const channelPermission = new ChannelPermission(channelAcl);
  return channelPermission.canModerateChannel(user as IDiscussionsUser);
}
