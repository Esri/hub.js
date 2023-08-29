import { IUser } from "@esri/arcgis-rest-auth";
import {
  IAddGroupUsersResult,
  IAddGroupUsersOptions,
  addGroupUsers,
} from "@esri/arcgis-rest-portal";
import { IAuthenticationManager } from "@esri/arcgis-rest-request";

/**
 *
 * Attempts to auto-add users to a group
 *
 * @param {string} id ID of the group the users will be added to
 * @param {IUser[]} users
 * @param {IAuthenticationManager} authentication
 *
 * @returns {IAddGroupUsersResult|null} Result of the transaction (null if no users are passed in)
 */
export function autoAddUsers(
  id: string,
  users: IUser[],
  authentication: IAuthenticationManager
): Promise<IAddGroupUsersResult | null> {
  let response: Promise<IAddGroupUsersResult | null> = Promise.resolve(null);
  if (users.length) {
    const args: IAddGroupUsersOptions = {
      id,
      users: users.map((u) => u.username),
      authentication,
    };
    response = addGroupUsers(args);
  }

  return response;
}
