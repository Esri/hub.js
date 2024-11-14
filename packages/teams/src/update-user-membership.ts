import { ArcGISIdentityManager } from "@esri/arcgis-rest-request";
import {
  updateUserMemberships,
  IUpdateGroupUsersResult,
} from "@esri/arcgis-rest-portal";

/**
 * Updates users membership to admin or member, acts as a wrapper for updateUserMemberships from arcgis-rest-portal
 *
 * @export
 * @param {string} id Group id that the members belong to
 * @param {string[]} users Array of usernames to update membership level on
 * @param {("member" | "admin")} newMemberType The type of user to update the users to
 * @param {ArcGISIdentityManager} authentication authentication
 * @return {*}  {Promise<IUpdateGroupUsersResult>}
 */
export async function updateUserMembership (
  id: string,
  users: string[],
  newMemberType: "member" | "admin",
  authentication: ArcGISIdentityManager
): Promise<IUpdateGroupUsersResult> {
  return updateUserMemberships({
    id,
    users,
    newMemberType,
    authentication,
  });
}
