import { IPortal } from "@esri/arcgis-rest-portal";
import { IHubSiteTheme } from "../core";
import { getProp, removeEmptyProps } from "../objects";
import { cloneObject, extend } from "../util";

/**
 * Default Site Theme
 */
export const DEFAULT_THEME: IHubSiteTheme = {
  header: {
    background: "#fff",
    text: "#4c4c4c",
  },
  body: {
    background: "#fff",
    text: "#4c4c4c",
    link: "#0079c1",
  },
  button: {
    background: "#0079c1",
    text: "#fff",
  },
  logo: {
    small: "",
  },
  fonts: {
    base: {
      url: "",
      family: "Avenir Next",
    },
    heading: {
      url: "",
      family: "Avenir Next",
    },
  },
};

/**
 * Return the default theme, extended with values from the Org's shared theme
 * @param {Object} portalSelf Org's Portal object
 */
export function getOrgDefaultTheme(portalSelf: IPortal) {
  let defaultTheme = cloneObject(DEFAULT_THEME);
  let sharedTheme = getProp(portalSelf, "portalProperties.sharedTheme");
  if (sharedTheme) {
    sharedTheme = removeEmptyProps(sharedTheme);
    defaultTheme = extend(defaultTheme, sharedTheme) as IHubSiteTheme;
  }
  return defaultTheme;
}
