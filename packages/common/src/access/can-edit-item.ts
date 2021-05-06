import { IItem, IUser } from "@esri/arcgis-rest-types";
import { hasBasePriv } from "./has-base-priv";
import { includes } from "../utils";

/**
 * Checks if user has access to edit an item in Hub
 * @param {IItem} item The item to be edited
 * @param {IUser} [user] An optional user
 * @returns {boolean}
 */
export function canEditItem(item: IItem, user?: IUser): boolean {
  return hasBasePriv(user) && includes(["admin", "update"], item.itemControl);
}
