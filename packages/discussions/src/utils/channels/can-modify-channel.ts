import { IUser } from "@esri/arcgis-rest-types";
import { IChannel, IDiscussionsUser } from "../../types";
import { ChannelPermission } from "../channel-permission";
import { isOrgAdminInOrg } from "../platform";
import { isAuthorizedToModifyChannelByLegacyPermissions } from "./is-authorized-to-modify-channel-by-legacy-permissions";

/**
 * Utility to determine if User has privileges to modify a channel
 * @deprecated use `canEditChannel` or `canDeleteChannel` instead
 * @param channel
 * @param user
 * @returns {boolean}
 */
export function canModifyChannel(
  channel: IChannel,
  user: IUser | IDiscussionsUser = {}
  // channelUpdates: IUpdateChannel,
): boolean {
  if (isOrgAdminInOrg(user, channel.orgId)) {
    return true;
  }

  if (channel.channelAcl) {
    const channelPermission = new ChannelPermission(channel);
    return channelPermission.canModerateChannel(user as IDiscussionsUser);
    // for V2: && channelPermission.canUpdateProperties(user as IDiscussionsUser, channelUpdates)
  }

  return isAuthorizedToModifyChannelByLegacyPermissions(user, channel);
}
