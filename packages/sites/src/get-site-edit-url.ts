import { IItem } from "@esri/arcgis-rest-types";

/**
 * Get the correct url used to edit the site
 * @param item the site item
 */
export function getSiteEditUrl(item: IItem) {
  return `${item.url}/edit`;
}
