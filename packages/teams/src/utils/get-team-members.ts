import { getGroupUsers } from "@esri/arcgis-rest-portal";
import { IGroupUsersResult } from "@esri/arcgis-rest-portal";
import { IHubRequestOptions } from "@esri/hub-common";
/**
 * Get the users(usernames ONLY) that are members of the Group that backs the Team
 * @param {string} id group id
 * @param {IRequestOptions} hubRequestOptions
 * @returns {Promise<IGroupUsersResult>}
 */
export function getTeamMembers(
  id: string,
  hubRequestOptions: IHubRequestOptions
): Promise<IGroupUsersResult> {
  return getGroupUsers(id, {
    authentication: hubRequestOptions.authentication
  });
}
