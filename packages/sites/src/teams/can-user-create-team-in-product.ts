import { IUser } from "@esri/hub-common/node_modules/@esri/arcgis-rest-auth";
import { hasAllPrivileges } from "./has-all-privileges";
import { HubProduct } from "@esri/hub-common";
import { IGroupTemplate } from "./types";

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
  // can this be created in the current environment?
  if (template.config.availableIn.includes(product)) {
    // and user has required privs...
    result = hasAllPrivileges(user, template.config.requiredPrivs);
  }
  return result;
}
