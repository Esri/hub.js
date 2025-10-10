import { IItem } from "@esri/arcgis-rest-portal";
import { normalizeItemType } from "@esri/hub-common";

/**
 * Determines whether an item is a site item or not
 * @param item - the item
 */
export function isSite(item: IItem) {
  return normalizeItemType(item) === "Hub Site Application";
}
