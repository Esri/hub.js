import { updateGroup } from "@esri/arcgis-rest-portal";
import { IAuthenticationManager } from "@esri/arcgis-rest-request";
import { IGroup } from "@esri/arcgis-rest-types";

/**
 * Updates a group. Wrapper around updateGroup from arcgis-rest-portal
 *
 * @export
 * @param {IGroup} group Group object that's being updated
 * @param {IAuthenticationManager} authentication Auth
 * @return {*}  {Promise<{ success: boolean; groupId: string }>}
 */
export async function updateTeam(
  group: IGroup,
  authentication: IAuthenticationManager
): Promise<{ success: boolean; groupId: string }> {
  return updateGroup({ group, authentication });
}
