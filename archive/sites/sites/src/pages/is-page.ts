import { IItem } from "@esri/arcgis-rest-portal";
import { normalizeItemType } from "@esri/hub-common";

/**
 * Determines whether an item is a page item or not
 * @param item - the item
 */
export function isPage(item: IItem) {
  return normalizeItemType(item) === "Hub Page";
}
