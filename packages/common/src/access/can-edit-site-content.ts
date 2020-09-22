import { IItem, IUser } from "@esri/arcgis-rest-types";
import { includes } from "../utils";
import { getProp } from "../objects";
import { hasBasePriv } from "./has-base-priv";
import { canEditItem } from "./can-edit-item";

export const REQUIRED_PRIVS = [
  "portal:user:createGroup",
  "portal:user:createItem",
  "portal:user:shareToGroup",
  "portal:user:viewOrgGroups",
  "portal:user:viewOrgItems"
];

/**
 *
 * @param {IItem} model
 * @param {IUser} currentUser
 * @returns {boolean}
 */
export function canEditSiteContent(model: IItem, currentUser?: IUser): boolean {
  let res = false;
  const isDefaultHubHome = getProp(model, "properties.isDefaultHubHome");
  const hasPriv = hasBasePriv(currentUser);
  if (!isDefaultHubHome && hasPriv) {
    res = canEditItem(model, currentUser);
  } else if (hasPriv) {
    const userOrgId = currentUser.orgId;
    const modelOrgId = model.orgId;
    const sameOrg = !!userOrgId && !!modelOrgId && userOrgId === modelOrgId;
    if (sameOrg) {
      const privileges = currentUser.privileges || [];
      res = REQUIRED_PRIVS.every(privilege => includes(privileges, privilege));
    }
  }
  return res;
}
