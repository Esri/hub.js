import { IItem, IUser } from "@esri/arcgis-rest-types";
import { hasBasePriv } from "./has-base-priv";
import { canEditItem } from "./can-edit-item";

/**
 *
 * @param {IItem} model
 * @param {IUser} currentUser
 * @returns {boolean}
 */
export function canEditDataset(model: IItem, currentUser?: IUser): boolean {
  return hasBasePriv(currentUser) && canEditItem(model, currentUser);
}
