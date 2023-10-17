import { UserSession } from "@esri/arcgis-rest-auth";
import {
  updateUserMemberships,
  IUpdateGroupUsersResult,
} from "@esri/arcgis-rest-portal";

/**
 * Updates users membership to admin or member in a group, acts as a wrapper for updateUserMemberships from arcgis-rest-portal
 *
 * @export
 * @param {string} id Group id that the members belong to
 * @param {string[]} users Array of usernames to update membership level on
 * @param {("member" | "admin")} newMemberType The type of user to update the users to
 * @param {UserSession} authentication authentication
 * @return {*}  {Promise<IUpdateGroupUsersResult>}
 */
export async function updateUserMembership(
  id: string,
  users: string[],
  newMemberType: "member" | "admin",
  authentication: UserSession
): Promise<IUpdateGroupUsersResult> {
  return updateUserMemberships({
    id,
    users,
    newMemberType,
    authentication,
  });
}
