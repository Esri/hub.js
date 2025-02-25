import { IGroupTemplate } from "../types";
import { IUser } from "@esri/arcgis-rest-types";
import { cloneObject, getWithDefault, includes } from "@esri/hub-common";

/**
 * Updates template based upon new privPropValues property
 * In the templates config hash.
 * This allows us to conditionally change out parts of the template
 * @param {object} user
 * @param {object} template
 * @returns {object} Returns updated template
 */
export function applyPrivPropValuesToTemplate(
  user: IUser,
  template: IGroupTemplate
): IGroupTemplate {
  const templateCopy = cloneObject(template);
  // Only two templates actually have this in config atm, so we want to be safe.
  const ppv = getWithDefault(template, "config.privPropValues", []);
  // iterate over privPropValues
  ppv.forEach((entry: any) => {
    // entry === each privPropValue obj { priv, prop, value}
    // If user privileges includes the privilege in privPropValue...
    if (includes(user.privileges, entry.priv)) {
      // update the group template with appropriate prop / value changes
      templateCopy[entry.prop] = entry.value; // for example updating the membershipAccess
    }
  });
  return templateCopy;
}
