import { IItem } from "@esri/arcgis-rest-types";

/**
 * Get the correct url used to edit the page
 * @param item the page item
 * @param isPortal from appSettings.isPortal
 * @param siteUrl the url of the parent site
 */
export function getPageEditUrl(
  item: IItem,
  isPortal: boolean,
  siteUrl: string
) {
  let prefix = "";
  if (isPortal) {
    prefix = siteUrl;
  }
  return `${prefix}/edit?pageId=${item.id}`;
}
