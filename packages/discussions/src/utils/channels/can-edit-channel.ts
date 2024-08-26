import { IUser } from "@esri/arcgis-rest-types";
import { IChannel, IDiscussionsUser, SharingAccess } from "../../types";
import { ChannelPermission } from "../channel-permission";
import { isAuthorizedToModifyChannelByLegacyPermissions } from "./is-authorized-to-modify-channel-by-legacy-permissions";
import { hasOrgAdminUpdateRights } from "../portal-privilege";

/**
 * Utility to determine if User has privileges to edit a channel
 * @param channel
 * @param user
 * @returns {boolean}
 */
export function canEditChannel(
  channel: IChannel,
  user: IUser | IDiscussionsUser = {}
): boolean {
  if (hasOrgAdminUpdateRights(user, channel.orgId)) {
    return true;
  }

  if (channel.channelAcl) {
    const channelPermission = new ChannelPermission(channel);
    return channelPermission.canModerateChannel(user as IDiscussionsUser);
  }

  return isAuthorizedToModifyChannelByLegacyPermissions(user, channel);
}
