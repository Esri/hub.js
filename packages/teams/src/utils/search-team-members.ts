import {
  searchGroupUsers,
  ISearchGroupUsersResult
} from "@esri/arcgis-rest-portal";
import { IHubRequestOptions } from "@esri/hub-common";

/**
 * Get the users(actual USER OBJECTS) that are members of the Group that backs the Team
 * @param {string} id group id
 * @param {ISearchGroupUsersOptions} hubRequestOptions
 * @returns {Promise<ISearchGroupUsersResult>}
 */
export function searchTeamMembers(
  id: string,
  hubRequestOptions: IHubRequestOptions
): Promise<ISearchGroupUsersResult> {
  return searchGroupUsers(id, hubRequestOptions);
}
