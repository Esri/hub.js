import { getGroup } from "@esri/arcgis-rest-portal";
import { IHubRequestOptions } from "@esri/hub-common";
/**
 * Get a team by id
 * @param id team id
 * @param hubRequestOptions
 * @returns
 */
export function getTeamById(id: string, hubRequestOptions: IHubRequestOptions) {
  return getGroup(id, hubRequestOptions);
}
