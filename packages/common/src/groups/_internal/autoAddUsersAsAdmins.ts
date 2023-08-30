import {
  IAddGroupUsersResult,
  IUser,
  addGroupUsers,
} from "@esri/arcgis-rest-portal";
import { IAuthenticationManager } from "@esri/arcgis-rest-request";

/**
 * @private
 * Auto add N users to a single group, with users added as admins of that group
 *
 * @export
 * @param {string} id Group ID
 * @param {IUser[]} admins array of users to add to group as admin
 * @param {IAuthenticationManager} authentication authentication manager
 * @return {IAddGroupUsersResult} Result of the transaction (null if no users are passed in)
 */
export function autoAddUsersAsAdmins(
  id: string,
  admins: IUser[],
  authentication: IAuthenticationManager
): Promise<IAddGroupUsersResult | null> {
  let response = Promise.resolve(null);
  if (admins.length) {
    const args = {
      id,
      admins: admins.map((a) => a.username),
      authentication,
    };
    response = addGroupUsers(args);
  }
  return response;
}
