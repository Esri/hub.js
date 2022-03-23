import { IPortal } from "@esri/arcgis-rest-portal";
import { getOrgDefaultTheme } from "@esri/hub-common";

/* istanbul ignore next */
/**
 * Return the default theme, extended with values from the Org's shared theme
 * @param {Object} portalSelf Org's Portal object
 */
export function getTheme(portalSelf: IPortal) {
  // eslint-disable-next-line no-console
  console.warn(
    `@esri/hub-sites::getTheme is deprecated. Please use @esri/hub-common::getOrgDefaultTheme instead`
  );
  return getOrgDefaultTheme(portalSelf);
}
