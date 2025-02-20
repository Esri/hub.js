import { IUser } from "@esri/arcgis-rest-portal";
import { IChannel, IDiscussionsUser } from "../../types";
import { isAuthorizedToModifyChannelByLegacyPermissions } from "./is-authorized-to-modify-channel-by-legacy-permissions";
import { hasOrgAdminDeleteRights } from "../portal-privilege";

/**
 * Utility to determine if User has privileges to delete a channel
 * @deprecated replace with canDeleteChannelV2 for v2 discussions
 * @export
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

  return isAuthorizedToModifyChannelByLegacyPermissions(user, channel);
}
