import { IItem, IUser } from "@esri/arcgis-rest-types";
import { hasBasePriv } from "./has-base-priv";
import { canEditItem } from "./can-edit-item";

/**
 * Checks if user has access to edit dataset in Hub
 * @param {IItem} model
 * @param {IUser} user
 * @returns {boolean}
 */
export function canEditDataset(model: IItem, user?: IUser): boolean {
  return hasBasePriv(user) && canEditItem(model, user);
}
