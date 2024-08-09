import { IUser } from "@esri/arcgis-rest-types";
import { IChannel, IDiscussionsUser, SharingAccess } from "../../types";
import { ChannelPermission } from "../channel-permission";
import { isOrgAdminInOrg } from "../platform";
import { isAuthorizedToModifyChannelByLegacyPermissions } from "./is-authorized-to-modify-channel-by-legacy-permissions";

/**
 * Utility to determine if User has privileges to modify a channel
 * Deprecating, replace with canEditChannel and canDeleteChannel
 * @param channel
 * @param user
 * @returns {boolean}
 */
export function canModifyChannel(
  channel: IChannel,
  user: IUser | IDiscussionsUser = {}
): boolean {
  if (isOrgAdminInOrg(user, channel.orgId)) {
    return true;
  }

  if (channel.channelAcl) {
    const channelPermission = new ChannelPermission(channel);
    return channelPermission.canModerateChannel(user as IDiscussionsUser);
  }

  return isAuthorizedToModifyChannelByLegacyPermissions(user, channel);
}
