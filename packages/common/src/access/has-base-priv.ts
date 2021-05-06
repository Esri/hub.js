import { IUser } from "@esri/arcgis-rest-types";
import { includes } from "../utils";

/**
 * Checks for fundamental privilege required by all access checks
 * @param {IUser} [user] An optional user
 * @returns {boolean}
 */
export function hasBasePriv(user?: IUser): boolean {
  let result = false;
  if (user) {
    const { privileges = [] } = user;
    result = includes(privileges, "portal:user:createItem");
  }
  return result;
}
