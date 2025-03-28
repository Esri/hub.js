import type { ArcGISIdentityManager } from "@esri/arcgis-rest-request";
import { removeGroup, unprotectGroup } from "@esri/arcgis-rest-portal";

/**
 * removeTeam unprotects a group, then deletes it
 *
 * @export
 * @param {string} id Team Id
 * @param {ArcGISIdentityManager} authentication authentication
 * @return {*}  {Promise<{groupId: string; success: boolean}>}
 */
export async function removeTeam(
  id: string,
  authentication: ArcGISIdentityManager
): Promise<{ groupId: string; success: boolean }> {
  // unprotect the group
  const unprotectResult = await unprotectGroup({ id, authentication });
  // If that succeeded...
  return unprotectResult.success
    ? // Remove it.
      removeGroup({ id, authentication })
    : // Otherwise return a fail state
      { groupId: id, success: false };
}
