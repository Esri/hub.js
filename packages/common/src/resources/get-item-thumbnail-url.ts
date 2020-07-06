import { IItem } from "@esri/arcgis-rest-types";
import { IHubRequestOptions } from "../types";
import { getPortalApiUrl } from "../urls";

/**
 * Get the url for an item's thumbnail
 * Returns null if the item does not have a thumbnail
 * assigned
 * @param {object} item Item
 * @param {IHubRequestOptions} hubRequestOptions
 */
export function getItemThumbnailUrl(
  item: IItem,
  hubRequestOptions: IHubRequestOptions
): string | null {
  if (item.thumbnail) {
    const portalRestUrl = getPortalApiUrl(hubRequestOptions.portalSelf);
    const itemUrl = `${portalRestUrl}/content/items/${item.id}`;
    const url = `${itemUrl}/info/${item.thumbnail}`;
    return url;
  } else {
    return null;
  }
}
