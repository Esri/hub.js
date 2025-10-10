import type { IItem } from "@esri/arcgis-rest-portal";

/**
 * Get the correct url used to edit the site
 * @param item the site item
 */
export function getSiteEditUrl(item: IItem) {
  return `${item.url}/edit`;
}
