import { IItem, IUser } from "@esri/arcgis-rest-portal";
import { includes } from "../utils";
import { getProp } from "../objects";
import { hasBasePriv } from "./has-base-priv";
import { canEditItem } from "./can-edit-item";

export const REQUIRED_PRIVS = [
  "portal:user:createGroup",
  "portal:user:createItem",
  "portal:user:shareToGroup",
  "portal:user:viewOrgGroups",
  "portal:user:viewOrgItems",
];

/**
 * Checks if user has access to content library in Hub
 * In Hub Home context, user access requires additional privileges
 * In initiative context, check is delegated to canEditItem for the initiative site item
 * @param {IItem} item
 * @param {IUser} user
 * @returns {boolean}
 */
export function canEditSiteContent(item: IItem, user: IUser): boolean {
  let res = false;
  const isDefaultHubHome = getProp(item, "properties.isDefaultHubHome");
  const hasPriv = hasBasePriv(user);
  if (!isDefaultHubHome && hasPriv) {
    res = canEditItem(item, user);
  } else if (hasPriv) {
    const userOrgId = user.orgId;
    const itemOrgId = item.orgId;
    const sameOrg = !!userOrgId && userOrgId === itemOrgId;
    if (sameOrg) {
      const privileges = user.privileges || [];
      res = REQUIRED_PRIVS.every((privilege) =>
        includes(privileges, privilege)
      );
    }
  }
  return res;
}
