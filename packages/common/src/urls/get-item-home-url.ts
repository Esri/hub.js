import { IHubRequestOptions } from "../types";
import { getPortalUrl } from "./get-portal-url";
import { IPortal } from "@esri/arcgis-rest-portal";

/**
 * Return the URL of the item's page in the Portal Home application
 * @param itemId The item's ID
 * @param {Object} urlOrObject a Portal API URL, request options object, or Portal self object
 */
export function getItemHomeUrl(
  itemId: string,
  urlOrObj: IPortal | IHubRequestOptions | string
): string {
  const portalUrl = getPortalUrl(urlOrObj);
  return `${portalUrl}/home/item.html?id=${itemId}`;
}
