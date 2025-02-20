import { IUser } from "@esri/arcgis-rest-types";
import { IChannel, IDiscussionsUser } from "../../types";
import { isAuthorizedToModifyChannelByLegacyPermissions } from "./is-authorized-to-modify-channel-by-legacy-permissions";
import { hasOrgAdminUpdateRights } from "../portal-privilege";

/**
 * Utility to determine if User has privileges to edit a channel
 * @export
 * @deprecated replace with canEditChannelV2 for v2 discussions
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

  return isAuthorizedToModifyChannelByLegacyPermissions(user, channel);
}
