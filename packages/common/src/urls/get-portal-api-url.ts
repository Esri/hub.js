import { IPortal } from "@esri/arcgis-rest-portal";
import { IHubRequestOptions } from "../types";
import { getPortalUrl } from "./get-portal-url";

/**
 * Return the portal sharing api base url, based on portal self
 * @param {Object} urlOrObject a Portal API URL, request options object, or Portal self object
 */
export function getPortalApiUrl(
  urlOrObj: IPortal | IHubRequestOptions | string
): string {
  return `${getPortalUrl(urlOrObj)}/sharing/rest`;
}
