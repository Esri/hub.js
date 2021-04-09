import {
  searchGroupUsers,
  ISearchGroupUsersResult,
  ISearchGroupUsersOptions
} from "@esri/arcgis-rest-portal";

/**
 * Get the users(actual USER OBJECTS) that are members of the Group that backs the Team
 * @param {string} id group id
 * @param {ISearchGroupUsersOptions} searchOptions
 * @returns {Promise<ISearchGroupUsersResult>}
 */
export function searchTeamMembers(
  id: string,
  searchOptions: ISearchGroupUsersOptions
): Promise<ISearchGroupUsersResult> {
  return searchGroupUsers(id, searchOptions);
}
