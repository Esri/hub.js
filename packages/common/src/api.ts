import { IRequestOptions } from "@esri/arcgis-rest-request";
import { getPortalUrl } from "@esri/arcgis-rest-portal";
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
  const portalUrl = getPortalUrl(requestOptions);
  if (portalUrl.match(/(qaext|\.mapsqa)\.arcgis.com/)) {
    return "https://hubqa.arcgis.com";
  } else if (portalUrl.match(/(devext|\.mapsdevext)\.arcgis.com/)) {
    return "https://hubdev.arcgis.com";
  } else if (portalUrl.match(/(www|\.maps)\.arcgis.com/)) {
    return "https://hub.arcgis.com";
  } else {
    return undefined;
  }
}
