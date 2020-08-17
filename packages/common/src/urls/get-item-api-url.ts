import { IHubRequestOptions } from "../types";
import { getPortalUrl } from "./get-portal-url";
import { IItem, IPortal } from "@esri/arcgis-rest-portal";

// NOTE: this fn is tested via getItemDataUrl tests
/**
 * Get the fully qualified URL to the item's REST end point
 * @param item w/ id and access
 * @param {Object} urlOrObject a Portal API URL, request options object, or Portal self object
 * @param token (optional) - token for the current user's session
 */
export const getItemApiUrl = (
  item: IItem,
  urlOrObj: IPortal | IHubRequestOptions | string,
  token?: string
) => {
  const { id, access } = item;
  const host = getPortalUrl(urlOrObj);
  let url = `${host}/sharing/rest/content/items/${id}?f=json`;
  if (access !== "public") {
    url = `${url}&token=${token}`;
  }
  return url;
};
