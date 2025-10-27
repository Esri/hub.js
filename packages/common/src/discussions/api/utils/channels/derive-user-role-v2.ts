import type { IUser } from "@esri/arcgis-rest-portal";
import { IChannel, IDiscussionsUser } from "../../types";
import { Role } from "../../enums/role";
import { ChannelPermission } from "../channel-permission";

/**
 * Derives the user role for the given channel and user
 * @param channel an IChannel object
 * @param user  An IUser or IDiscussionUser object
 * @returns the appropriate Role for the given user relative to the given channel
 */
export function deriveUserRoleV2(
  channel: IChannel,
  user: IUser | IDiscussionsUser = {}
): Role {
  const channelPermission = new ChannelPermission(channel);
  return channelPermission.deriveUserRole(user);
}
