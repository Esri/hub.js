import { IUser } from "@esri/arcgis-rest-types";
import { includes } from "../utils";

/**
 * Checks for fundamental privilege required by all access checks
 * @param {IUser} user
 * @returns {boolean}
 */
export function hasBasePriv(user?: IUser): boolean {
  let res = false;
  if (user) {
    res = includes(user.privileges, "portal:user:createItem");
  }
  return res;
}
