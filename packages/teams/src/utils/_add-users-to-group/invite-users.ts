import { IUser } from "@esri/arcgis-rest-auth";
import {
  IInviteGroupUsersResult,
  IInviteGroupUsersOptions,
  inviteGroupUsers
} from "@esri/arcgis-rest-portal";
import { IAuthenticationManager } from "@esri/arcgis-rest-request";

/**
 *
 * Attempts to invite users to a group
 *
 * @param {string} id ID of the group the users will be invited to
 * @param {object[]} users
 * @param {object} authentication
 * @param {number} expiration How long the invite will be active (in minutes)
 *
 * @returns {object|null} Result of the transaction (null if no users are passed in)
 */
export function inviteUsers(
  id: string,
  users: IUser[],
  authentication: IAuthenticationManager,
  expiration = 20160 // default to 2 week expiration TODO: is this actually 2 weeks?
): Promise<IInviteGroupUsersResult> {
  let response: Promise<IInviteGroupUsersResult> = Promise.resolve(null);
  if (users.length) {
    const args: IInviteGroupUsersOptions = {
      id,
      users: users.map(u => u.username),
      authentication,
      role: "group_member",
      expiration
    };

    response = inviteGroupUsers(args);
  }

  return response;
}
