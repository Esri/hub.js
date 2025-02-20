import { IUser } from "@esri/arcgis-rest-portal";
import { IDiscussionsUser } from "@esri/hub-common";
import { isOrgAdminInOrg, isUserInOrg, userHasPrivileges } from "./platform";

/**
 * @internal
 * @hidden
 */
export function hasOrgAdminViewRights(
  user: IUser | IDiscussionsUser = {},
  orgId: string
): boolean {
  return (
    isOrgAdminInOrg(user, orgId) ||
    (isUserInOrg(user, orgId) &&
      userHasPrivileges(user, ["portal:admin:viewItems"]))
  );
}

/**
 * @internal
 * @hidden
 */
export function hasOrgAdminUpdateRights(
  user: IUser | IDiscussionsUser = {},
  orgId: string
): boolean {
  return (
    isOrgAdminInOrg(user, orgId) ||
    (isUserInOrg(user, orgId) &&
      userHasPrivileges(user, [
        "portal:admin:viewItems",
        "portal:admin:updateItems",
      ]))
  );
}

/**
 * @internal
 * @hidden
 */
export function hasOrgAdminDeleteRights(
  user: IUser | IDiscussionsUser = {},
  orgId: string
): boolean {
  return (
    isOrgAdminInOrg(user, orgId) ||
    (isUserInOrg(user, orgId) &&
      userHasPrivileges(user, [
        "portal:admin:viewItems",
        "portal:admin:deleteItems",
      ]))
  );
}
