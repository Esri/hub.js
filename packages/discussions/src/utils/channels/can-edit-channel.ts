import { IGroup, IUser } from "@esri/arcgis-rest-types";
import { IChannel, IDiscussionsUser, SharingAccess } from "../../types";
import { ChannelPermission } from "../channel-permission";
import {
  isOrgAdminInOrg,
  isUserInOrg,
  userHasPrivilege,
  userHasPrivileges,
} from "../platform";

const ADMIN_GROUP_ROLES = Object.freeze(["owner", "admin"]);

/**
 * Utility to determine if User has privileges to modify a channel
 * @param channel
 * @param user
 * @returns {boolean}
 */
export function canEditChannel(
  channel: IChannel,
  user: IUser | IDiscussionsUser = {}
): boolean {
  const { orgId } = channel;

  // if (
  //   (isOrgAdminInOrg(user, orgId) &&
  //     userHasPrivilege(user, 'portal:admin:updateItems')) ||
  //   (isUserInOrg(user, orgId) &&
  //    userHasPrivileges(user, ['portal:admin:viewItems', 'portal:admin:updateItems']))
  // ) {
  //   return true;
  // }

  const channelPermission = new ChannelPermission(channel);
  return channelPermission.canModerateChannel(user as IDiscussionsUser);
}
