import { IUser } from "@esri/arcgis-rest-auth";

/**
 * @private
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
