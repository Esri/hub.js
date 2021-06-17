import { IGroupTemplate } from "../types";
import { IUser } from "@esri/arcgis-rest-types";
import { cloneObject, includes } from "@esri/hub-common";

export function updateTemplateBasedOnPrivs(
  user: IUser,
  template: IGroupTemplate
): IGroupTemplate {
  const copyTemplate = cloneObject(template);
  // Only two templates actually have this in config atm, so we want to be safe.
  if (template.config.privPropValues && template.config.privPropValues.length) {
    // iterate over privPropValues
    template.config.privPropValues.forEach(entry => {
      // entry === each privPropValue obj { priv, prop, value}
      // If user privileges includes the privilege in privPropValue...
      if (includes(user.privileges, entry.priv)) {
        // update the group template with appropriate prop / value changes
        copyTemplate[entry.prop] = entry.value; // for example updating the membershipAccess
      }
    });
  }
  return copyTemplate;
}
