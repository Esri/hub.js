import { IItem } from "@esri/arcgis-rest-types";

/**
 * Get the correct url used to edit the site
 * @param item the site item
 * @param isPortal from appSettings.isPortal
 * @param siteUrl the url of the parent site
 */
export function getEditUrl(item: IItem) {
  return `${item.url}/edit`;
}
