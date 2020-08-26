import { IRequestOptions } from "@esri/arcgis-rest-request";
import { IPortal } from "@esri/arcgis-rest-portal";
import { IHubRequestOptions } from "../types";
import { getPortalUrl } from "./get-portal-url";

/**
 * ```js
 * import { getPortalApiUrl } from "@esri/hub-common";
 * // from a portal base URL
 * let portalApiUrl = getPortalApiUrl("https://org.maps.arcgis.com"); // https://org.maps.arcgis.com/sharing/rest
 * // from an enterprise portal self response (IPortal)
 * let portalSelf = { isPortal: true, portalHostname: "server.example.org" };
 * portalApiUrl = getPortalApiUrl(portalSelf); // https://server.example.org/sharing/rest
 * // from an online portal self response (IPortal)
 * portalSelf = { isPortal: false, urlKey: "org", customBaseUrl: "maps.arcgis.com" };
 * portalApiUrl = getPortalApiUrl(portalSelf); // https://org.maps.arcgis.com/sharing/rest
 * // from hub request options (IHubRequestOptions) with a portal self (IPortal)
 * let requestOptions = { isPortal: false, portalSelf };
 * portalApiUrl = getPortalApiUrl(requestOptions); // https://org.maps.arcgis.com/sharing/rest
 * // from request options (IRequestOptions) with a portal (string)
 * requestOptions = { portal: "https://org.maps.arcgis.com/sharing/rest" };
 * portalApiUrl = getPortalApiUrl(requestOptions); // https://org.maps.arcgis.com/sharing/rest
 * ```
 * Derive a portal's API URL from the portal's base URL, a portal object, or request options
 * @param urlOrObject a portal base URL, a portal object, or request options containing either of those
 * @returns The portal API URL, defaults to `https://www.arcgis.com/sharing/rest`
 */
export function getPortalApiUrl(
  urlOrObject?: string | IPortal | IHubRequestOptions | IRequestOptions
): string {
  return `${getPortalUrl(urlOrObject)}/sharing/rest`;
}
