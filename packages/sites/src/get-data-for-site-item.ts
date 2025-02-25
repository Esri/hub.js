import { IItem } from "@esri/arcgis-rest-types";
import { IHubRequestOptions, upgradeSiteSchema } from "@esri/hub-common";
import { getItemData } from "@esri/arcgis-rest-portal";

/**
 * Get the data for a site item. Used by the UI to back-fill
 * a site model's `.data`, usually after we already have the item
 * as a result of a search.
 * Schema upgrades are applied.
 * @param {Object} item Site Item object
 * @param {IHubRequestOptions} hubRequestOptions
 */
export function getDataForSiteItem(
  item: IItem,
  hubRequestOptions: IHubRequestOptions
) {
  return getItemData(item.id, hubRequestOptions).then((data) => {
    return upgradeSiteSchema({
      item,
      data,
    });
  });
}
