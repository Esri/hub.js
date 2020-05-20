import { IRequestOptions } from "@esri/arcgis-rest-request";
import { getPortalUrl } from "@esri/arcgis-rest-portal";
import { _getHubUrlFromPortalHostname } from './urls/_get-hub-url-from-portal-hostname';
/**
 * ```js
 * import { getHubApiUrl() } from "@esri/hub-common";
 * //
 * getHubApiUrl({ portal: "https://custom.maps.arcgis.com/sharing/rest" })
 * >> "https://hub.arcgis.com"
 * ```
 * Retrieves the Hub API Url associated with a specific ArcGIS Online organization.
 * @param requestOptions - request options that may include authentication
 * @returns the associated Hub API Url as a string.
 */
export function getHubApiUrl(requestOptions: IRequestOptions): string {
  return _getHubUrlFromPortalHostname(getPortalUrl(requestOptions));
  
}


