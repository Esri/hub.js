import { IItem } from "@esri/arcgis-rest-portal";
import { includes } from "@esri/hub-common";

/**
 * Determines whether an item is a site item or not
 * @param item - the item
 */
export function isSite(item: IItem) {
  return (
    includes(["Hub Site Application", "Site Application"], item.type) ||
    (item.type === "Web Mapping Application" &&
      includes(item.typeKeywords, "hubSite"))
  );
}
