import { IUser } from "@esri/arcgis-rest-auth";

/**
 * Hoisted from Torii so we can more easily move this to typescript
 * @param {current user from session} user
 * @param {array} privileges
 */
export function hasAllPrivileges(user: IUser, privileges: string[]) {
  let result = false;
  // ensure we were passed an array...
  if (Array.isArray(privileges)) {
    result = privileges.every(priv => user.privileges.indexOf(priv) > -1);
  }
  return result;
}
