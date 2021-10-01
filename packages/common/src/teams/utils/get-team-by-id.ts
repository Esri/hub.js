import { getGroup } from "@esri/arcgis-rest-portal";
import { IGroup } from "@esri/arcgis-rest-portal";
import { IHubRequestOptions } from "../../";
/**
 * Get a team by id
 * @param {string} id group id
 * @param {IRequestOptions} hubRequestOptions
 * @returns {Promise<IGroup>}
 */
export function getTeamById(
  id: string,
  hubRequestOptions: IHubRequestOptions
): Promise<IGroup> {
  return getGroup(id, hubRequestOptions);
}
