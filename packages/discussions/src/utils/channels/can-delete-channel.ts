import { IUser } from "@esri/arcgis-rest-types";
import { IChannel, IDiscussionsUser } from "../../types";
import { ChannelPermission } from "../channel-permission";
import { isAuthorizedToModifyChannelByLegacyPermissions } from "./is-authorized-to-modify-channel-by-legacy-permissions";
import { hasOrgAdminDeleteRights } from "../portal-privilege";

/**
 * Utility to determine if User has privileges to delete a channel
 * @param channel
 * @param user
 * @returns {boolean}
 */
export function canDeleteChannel(
  channel: IChannel,
  user: IUser | IDiscussionsUser = {}
): boolean {
  if (hasOrgAdminDeleteRights(user, channel.orgId)) {
    return true;
  }

  if (channel.channelAcl) {
    const channelPermission = new ChannelPermission(channel);
    return channelPermission.canModerateChannel(user as IDiscussionsUser);
  }

  return isAuthorizedToModifyChannelByLegacyPermissions(user, channel);
}
