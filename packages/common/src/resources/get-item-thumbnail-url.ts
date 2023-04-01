import { IRequestOptions } from "@esri/arcgis-rest-request";

import { IPortal, IItem } from "@esri/arcgis-rest-portal";
import { IHubRequestOptions } from "../types";
import { getItemApiUrl } from "../urls/get-item-api-url";

export interface IThumbnailOptions {
  token?: string;
  width?: number;
}

/**
 * Get the fully qualified URL for an item's thumbnail
 * @param item w/ id, thumbnail, and access
 * @param portalUrlOrObject a portal base or API URL, a portal object, or request options containing either of those
 * @param optionsOrToken options including width and/or token for the current user's session; will only be appended as a query parameter if the item's access is **not** `public`
 * @returns URL to the item's thumbnail, defaults to `https://www.arcgis.com/sharing/rest/content/items/{item.id}/info/{item.thumbnail}`. Returns `null` if the item does not have a thumbnail assigned.
 */
export function getItemThumbnailUrl(
  item: IItem,
  portalUrlOrObject?: string | IPortal | IHubRequestOptions | IRequestOptions,
  optionsOrToken?: IThumbnailOptions | string
): string | null {
  if (!item || !item.thumbnail) {
    // TODO: handle image types by returning the image (item data) itself?
    return null;
  }
  // tslint:disable-next-line prefer-const
  let { token, width } = (optionsOrToken as IThumbnailOptions) || {};
  // TODO: at the next breaking change drop support for passing token as string
  if (!token && typeof optionsOrToken === "string") {
    token = optionsOrToken;
  }
  const itemApiUrl = getItemApiUrl(item, portalUrlOrObject, token);
  const [baseUrl, search] = itemApiUrl.split("?");
  const searchParams = new URLSearchParams(search);
  searchParams.delete("f");
  if (width) {
    searchParams.append("w", width + "");
  }
  const newSearch = searchParams.toString();
  const url = `${baseUrl}/info/${item.thumbnail}`;
  return newSearch ? `${url}?${newSearch}` : url;
}
