import { getGroupUsers } from "@esri/arcgis-rest-portal";
import { IGroupUsersResult } from "@esri/arcgis-rest-portal";
import { IHubRequestOptions } from "@esri/hub-common";
/**
 * Get the users(usernames ONLY) that are members of the Group that backs the Team
 * @param id team id
 * @param hubRequestOptions
 * @returns
 */
export function getTeamMembers(
  id: string,
  hubRequestOptions: IHubRequestOptions
): Promise<IGroupUsersResult> {
  return getGroupUsers(id, hubRequestOptions);
}
