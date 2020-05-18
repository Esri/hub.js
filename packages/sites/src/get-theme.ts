import { IPortal } from "@esri/hub-common/node_modules/@esri/arcgis-rest-portal";
import { DEFAULT_THEME } from "./default-theme";
import {
  cloneObject,
  getProp,
  removeEmptyProps,
  extend
} from "@esri/hub-common";
import { IHubSiteTheme } from "./types";

/**
 * Return the default theme, extended with values from the Org's shared theme
 * @param {Object} portalSelf Org's Portal object
 */
export function getTheme(portalSelf: IPortal) {
  let defaultTheme = cloneObject(DEFAULT_THEME);
  let sharedTheme = getProp(portalSelf, "portalProperties.sharedTheme");
  if (sharedTheme) {
    sharedTheme = removeEmptyProps(sharedTheme);
    defaultTheme = extend(defaultTheme, sharedTheme) as IHubSiteTheme;
  }
  return defaultTheme;
}
