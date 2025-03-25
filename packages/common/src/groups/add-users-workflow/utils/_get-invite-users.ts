import type { IUser } from "@esri/arcgis-rest-portal";
import { _getAutoAddUsers } from "./_get-auto-add-users";

/**
 * @private
 *
 * A user will be invited if they cannot be auto-added
 */
export function _getInviteUsers(
  users: IUser[],
  requestingUser: IUser
): IUser[] {
  const autoAddedUsers = _getAutoAddUsers(users, requestingUser);
  return users.filter(
    (user) => !autoAddedUsers.some((aau) => aau.username === user.username)
  );
}
