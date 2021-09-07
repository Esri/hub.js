import { IRequestOptions } from "@esri/arcgis-rest-request";
import { IPortal } from "@esri/arcgis-rest-portal";
import { IHubRequestOptions } from "./types";
import { getPortalApiUrl } from "./urls";
import { _getHubUrlFromPortalHostname } from "./urls/_get-hub-url-from-portal-hostname";
/**
 * ```js
 * import { getHubApiUrl() } from "@esri/hub-common";
 * //
 * getHubApiUrl({ portal: "https://custom.maps.arcgis.com/sharing/rest" })
 * >> "https://hub.arcgis.com"
 * ```
 * Retrieves the Hub API Url associated with a specific ArcGIS Online organization.
 * @param urlOrObject a Portal URL, Portal API URL, request options object, or Portal self object
 * @returns the associated Hub API Url as a string.
 */
export function getHubApiUrl(
  urlOrObject: IPortal | IHubRequestOptions | IRequestOptions | string
): string {
  const hubApiUrl =
    urlOrObject && (urlOrObject as IHubRequestOptions).hubApiUrl;
  if (hubApiUrl) {
    // this is request options w/ hubApiUrl already defined
    return hubApiUrl;
  }
  return _getHubUrlFromPortalHostname(getPortalApiUrl(urlOrObject));
}
