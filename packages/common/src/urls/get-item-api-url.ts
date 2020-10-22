import { IRequestOptions } from "@esri/arcgis-rest-request";
import { IItem, IPortal } from "@esri/arcgis-rest-portal";
import { IHubRequestOptions } from "../types";
import { getPortalApiUrl } from "./get-portal-api-url";

// NOTE: this fn is tested via getItemDataUrl tests

/**
 * Get the fully qualified URL to the REST end point for an item.
 * @param item w/ id and access
 * @param portalUrlOrObject a portal base or API URL, a portal object, or request options containing either of those
 * @param token token for the current user's session; will only be appended as a query parameter if the item's access is **not** `public`
 * @returns URL to the item's REST end point, defaults to `https://www.arcgis.com/sharing/rest/content/items/{item.id}?f=json`
 */
export const getItemApiUrl = (
  item: IItem,
  portalUrlOrObject?: string | IPortal | IHubRequestOptions | IRequestOptions,
  token?: string
) => {
  const { id, access } = item;
  const url = `${getPortalApiUrl(portalUrlOrObject)}/content/items/${id}`;
  const params = new URLSearchParams({ f: "json" });
  // TODO: derive token from from requestOptions if passed in?
  if (access !== "public" && token) {
    params.append("token", token);
  }
  return `${url}?${params.toString()}`;
};
