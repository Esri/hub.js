import { IRemoveGroupUsersResult } from "@esri/arcgis-rest-portal";
import { IAuthenticationManager } from "@esri/arcgis-rest-request";
import { removeUsersFromTeam } from "./remove-users-from-team";

/**
 * Removes N users from N teams. Calls removeUsersFromTeam on each of the N teams
 *
 * @export
 * @param {string[]} teamIds Array of team ids
 * @param {string[]} usernames Array of usernames to remove
 * @param {IAuthenticationManager} ro Auth
 * @return {*}  {Promise<IRemoveGroupUsersResult[]>}
 */
export async function removeUsersFromTeams(
  teamIds: string[],
  usernames: string[],
  ro: IAuthenticationManager
): Promise<IRemoveGroupUsersResult[]> {
  return Promise.all(
    teamIds.map((id) => removeUsersFromTeam(id, usernames, ro))
  );
}
