import { IUser } from "@esri/arcgis-rest-portal";

/**
 * @private
 *
 * A user can be auto-added if they are part of the requesting user's e-org
 * or c-org and the requesting user has the assignToGroups privilege
 */
export function _getAutoAddUsers(
  users: IUser[],
  requestingUser: IUser
): IUser[] {
  let usersToAutoAdd: IUser[] = [];
  if (requestingUser.privileges.indexOf("portal:admin:assignToGroups") !== -1) {
    const orgIds = [requestingUser.orgId, requestingUser.cOrgId].filter(o => o);
    usersToAutoAdd = users.filter(u => orgIds.indexOf(u.orgId) !== -1);
  }

  return usersToAutoAdd;
}
