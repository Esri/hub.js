import { IRequestOptions } from "@esri/arcgis-rest-request";
import { IPortal } from "@esri/arcgis-rest-portal";
import { IHubRequestOptions } from "../types";
import { getPortalUrl } from "./get-portal-url";

/**
 * Derive a portal's API URL from the portal's base URL, a portal object, or request options
 * @param urlOrObject a portal base URL, a portal object, or request options containing either of those
 * @returns The portal API URL, defaults to `https://www.arcgis.com/sharing/rest`
 */
export function getPortalApiUrl(
  urlOrObject?: string | IPortal | IHubRequestOptions | IRequestOptions
): string {
  return `${getPortalUrl(urlOrObject)}/sharing/rest`;
}
