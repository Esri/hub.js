import { IItem, IUser } from "@esri/arcgis-rest-types";
import { getProp } from "../objects";
import { hasBasePriv } from "./has-base-priv";
import { canEditItem } from "./can-edit-item";

/**
 *
 * @param {IItem} model
 * @param {IUser} currentUser
 * @returns {boolean}
 */
export function canEditSite(model: IItem, currentUser?: IUser): boolean {
  let res = false;
  const isDefaultHubHome = getProp(model, "properties.isDefaultHubHome");
  if (!isDefaultHubHome && hasBasePriv(currentUser)) {
    res = canEditItem(model, currentUser);
  }
  return res;
}
