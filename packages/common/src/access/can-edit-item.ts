import { IItem, IUser, IGroup } from "@esri/arcgis-rest-types";
import { isUpdateGroup, includes } from "../utils";
import { getProp } from "../objects";
import { hasBasePriv } from "./has-base-priv";

/**
 *
 * @param {IItem} model
 * @param {IUser} currentUser
 * @returns {boolean}
 */
export function canEditItem(model: IItem, currentUser?: IUser): boolean {
  let res = false;
  if (currentUser) {
    const itemControls = ["admin", "update"];
    const { itemControl, owner, orgId: itemOrgId } = model;
    let { isOrgItem } = model;
    const {
      roleId,
      role,
      username,
      groups: userGroups,
      orgId: userOrgId
    } = currentUser;
    const hasItemControl = includes(itemControls, itemControl);
    const isOwner = !!owner && !!username && owner === username;
    if (!isOrgItem) {
      isOrgItem = !!itemOrgId && !!userOrgId && itemOrgId === userOrgId;
    }
    const isItemOrgAdmin = !!isOrgItem && !roleId && role === "org_admin";
    const hasPlatformControl = hasItemControl || isOwner || isItemOrgAdmin;
    const hasPriv = hasBasePriv(currentUser);
    if (hasPriv && hasPlatformControl) {
      res = true;
    } else if (hasPriv) {
      const itemGroups = [
        ...(getProp(model, "groupIds") || []),
        getProp(model, "properties.collaborationGroupId")
      ];
      const isGroupEditable = (group: IGroup): boolean =>
        isUpdateGroup(group) && includes(itemGroups, group.id);
      res = userGroups.some(isGroupEditable);
    }
  }
  return res;
}
