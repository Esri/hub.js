import { IItem } from "@esri/arcgis-rest-portal";
import { includes } from "@esri/hub-common";

/**
 * Determines whether an item is a page item or not
 * @param item - the item
 * @param isPortal - whether or not we are on portal
 */
export function isPage(item: IItem) {
  return (
    includes(["Hub Page", "Site Page"], item.type) ||
    (item.type === "Web Mapping Application" &&
      includes(item.typeKeywords, "hubPage"))
  );
}
