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
  portalApiUrlOrHubRequestOptions: string | IHubRequestOptions
): string | null {
  if (!item || !item.thumbnail) {
    return null;
  }
  const portalRestUrl =
    typeof portalApiUrlOrHubRequestOptions === "string"
      ? portalApiUrlOrHubRequestOptions
      : getPortalApiUrl(portalApiUrlOrHubRequestOptions.portalSelf);
  const itemRestUrl = `${portalRestUrl}/content/items/${item.id}`;
  // TODO: handle image types by returning the image itself?
  const url = `${itemRestUrl}/info/${item.thumbnail}`;
  return url;
}
