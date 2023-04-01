import { IUser } from "@esri/arcgis-rest-portal";
import { includes } from "../utils";

/**
 * Checks for fundamental privilege required by all access checks
 * @param {IUser} user
 * @returns {boolean}
 */
export function hasBasePriv(user: IUser): boolean {
  const { privileges = [] } = user;
  return includes(privileges, "portal:user:createItem");
}
