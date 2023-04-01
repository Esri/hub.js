import { IItem, IUser } from "@esri/arcgis-rest-portal";
import { getProp } from "../objects";
import { hasBasePriv } from "./has-base-priv";
import { canEditItem } from "./can-edit-item";

/**
 * Checks if user has access to edit site in Hub
 * Currently, Hub Home sites are not editable
 * In initiative context, check is delegated to canEditItem for the initiative site item
 * @param {IItem} model
 * @param {IUser} user
 * @returns {boolean}
 */
export function canEditSite(model: IItem, user: IUser): boolean {
  let res = false;
  const isDefaultHubHome = getProp(model, "properties.isDefaultHubHome");
  if (!isDefaultHubHome && hasBasePriv(user)) {
    res = canEditItem(model, user);
  }
  return res;
}
