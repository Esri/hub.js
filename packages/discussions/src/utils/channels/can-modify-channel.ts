import { IUser } from "@esri/arcgis-rest-types";
import { IChannel, IDiscussionsUser } from "../../types";
import { isOrgAdminInOrg } from "../platform";
import { isAuthorizedToModifyChannelByLegacyPermissions } from "./is-authorized-to-modify-channel-by-legacy-permissions";

// NO V2 EQUIVALENT. Use canEditChannelV2 or canDeleteChannelV2
/**
 * Utility to determine if User has privileges to modify a channel
 * @deprecated use `canEditChannelV2` or `canDeleteChannelV2` instead.
 * @export
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

  return isAuthorizedToModifyChannelByLegacyPermissions(user, channel);
}
