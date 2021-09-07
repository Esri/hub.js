import { UserSession } from "@esri/arcgis-rest-auth";
import { removeGroup, unprotectGroup } from "@esri/arcgis-rest-portal";

/**
 * removeTeam unprotects a group, then deletes it
 *
 * @export
 * @param {string} id Team Id
 * @param {UserSession} authentication authentication
 * @return {*}  {Promise<any>}
 */
export async function removeTeam(
  id: string,
  authentication: UserSession
): Promise<any> {
  // unprotect the group
  const unprotectResult = await unprotectGroup({ id, authentication });
  // If that succeeded...
  if (unprotectResult.success) {
    // Remove it.
    await removeGroup({ id, authentication });
  }
}
