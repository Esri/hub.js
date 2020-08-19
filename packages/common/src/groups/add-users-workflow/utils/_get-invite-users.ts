import { IUser } from "@esri/arcgis-rest-auth";
import { _getAutoAddUsers } from "./_get-auto-add-users";

/**
 * @private
 */
export function _getInviteUsers(
  users: IUser[],
  requestingUser: IUser
): IUser[] {
  const autoAddedUsers = _getAutoAddUsers(users, requestingUser);
  return users.filter(
    user => !autoAddedUsers.some(aau => aau.username === user.username)
  );
}
