import { IUser } from "@esri/arcgis-rest-auth";
import { _canEmailUser } from "./_can-email-user";
import { _getInviteUsers } from "./_get-invite-users";

/**
 * @private
 */
export function _getEmailUsers(
  users: IUser[],
  requestingUser: IUser,
  includeSelf = false
): IUser[] {
  const invitedUsers = _getInviteUsers(users, requestingUser);
  const emailUsers = invitedUsers.filter(user =>
    _canEmailUser(user, requestingUser)
  );
  if (includeSelf) {
    emailUsers.push(requestingUser);
  }
  return emailUsers;
}
