import { IUser } from "@esri/arcgis-rest-auth";
import { hasAllPrivileges } from "./has-all-privileges";
import { getProp, HubProduct, includes } from "../../";
import { IGroupTemplate } from "../types";

/**
 * Predicate for filtering group templates based on product
 * and user privs required.
 * Param order is optimized for partial application
 * @param {object} user
 * @param {string} product basic, premium, portal
 * @param {object} template Team (group) template
 */
export function canUserCreateTeamInProduct(
  user: IUser,
  product: HubProduct,
  template: IGroupTemplate
) {
  let result = false;
  const userGroups = getProp(user, "groups") || [];
  // can this be created in the current environment?
  if (
    userGroups.length < 507 &&
    includes(template.config.availableIn, product)
  ) {
    // and user has required privs...
    result = hasAllPrivileges(user, template.config.requiredPrivs);
  }
  return result;
}
