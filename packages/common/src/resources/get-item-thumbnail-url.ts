import { IItem } from "@esri/arcgis-rest-types";
import { IPortal } from "@esri/arcgis-rest-portal";
import { IHubRequestOptions } from "../types";
import { getPortalApiUrl } from "../urls";

/**
 * Get the url for an item's thumbnail
 * Returns null if the item does not have a thumbnail
 * assigned
 * @param item
 * @param urlOrObject either a portal URL, a portal object, or request options
 */
export function getItemThumbnailUrl(
  item: IItem,
  urlOrObject: string | IPortal | IHubRequestOptions
): string | null {
  if (!item || !item.thumbnail) {
    return null;
  }
  // get portal URL from second arg
  let portalApiUrl;
  if (typeof urlOrObject === "string") {
    // assume it's the URL itself
    portalApiUrl = urlOrObject;
  } else {
    const portalSelf = urlOrObject.portalSelf
      ? // assume it's request options
        urlOrObject.portalSelf
      : // assume it's a portal
        urlOrObject;
    portalApiUrl = getPortalApiUrl(portalSelf);
  }
  const itemRestUrl = `${portalApiUrl}/content/items/${item.id}`;
  // TODO: handle image types by returning the image itself?
  const url = `${itemRestUrl}/info/${item.thumbnail}`;
  return url;
}
