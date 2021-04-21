import { IUser } from "@esri/arcgis-rest-portal";

/**
 * @private
 */
export function _isOrgAdmin(user: IUser): boolean {
  return user.role === "org_admin" && !user.roleId;
}
