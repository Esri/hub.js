import {
  IRemoveGroupUsersResult,
  removeGroupUsers,
} from "@esri/arcgis-rest-portal";
import { IAuthenticationManager } from "@esri/arcgis-rest-request";

/**
 * Remove N users from team. Acts as a wrapper around removeGroupUsers from arcgis-rest-portal
 *
 * @export
 * @param {string} id Group Id
 * @param {string[]} users Array of usernames to remove
 * @param {IAuthenticationManager} authentication auth
 * @return {*}  {Promise<IRemoveGroupUsersResult>}
 */
export async function removeUsersFromTeam(
  id: string,
  users: string[],
  authentication: IAuthenticationManager
): Promise<IRemoveGroupUsersResult> {
  return removeGroupUsers({
    id,
    users,
    authentication,
  });
}
