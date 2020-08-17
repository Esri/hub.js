import { IHubRequestOptions } from "../types";
import { getItemApiUrl } from "./get-item-api-url";
import { IItem, IPortal } from "@esri/arcgis-rest-portal";

/**
 * Get the fully qualified URL to the item's data REST end point
 * @param item w/ id and access
 * @param {Object} urlOrObject a Portal API URL, request options object, or Portal self object
 * @param token (optional) - token for the current user's session
 */
export const getItemDataUrl = (
  item: IItem,
  urlOrObj: IPortal | IHubRequestOptions | string,
  token?: string
) => {
  const url = getItemApiUrl(item, urlOrObj, token);
  const pattern = `\\/${item.id}\\?f=json`;
  const regExp = new RegExp(pattern);
  // TODO: append f param based on item.type?
  return (
    url && url.replace(regExp, `/${item.id}/data`).replace(/\&token/, "?token")
  );
};
