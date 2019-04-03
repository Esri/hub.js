import { IRequestOptions, getPortalUrl } from "@esri/arcgis-rest-request";

/**
 * ```js
 * import { getHubAPIUrl() } from "@esri/hub-common";
 * //
 * getHubAPIUrl({ portal: "https://custom.maps.arcgis.com/sharing/rest" })
 * >> "https://hub.arcgis.com"
 * ```
 * Retrieves the Hub API Url associated with a specific ArcGIS Online organization.
 * @param requestOptions - request options that may include authentication
 * @returns the associated Hub API Url as a string.
 */
export function getHubAPIUrl(requestOptions: IRequestOptions): string {
  const portalUrl = getPortalUrl(requestOptions);
  if (portalUrl.match(/(qaext|\.mapsqa\.)/)) {
    return "https://hubqa.arcgis.com";
  } else if (portalUrl.match(/(devext|\.mapsdevext\.)/)) {
    return "https://hubdev.arcgis.com";
  } else if (portalUrl.match(/(www|\.maps\.)/)) {
    return "https://hub.arcgis.com";
  } else return undefined;
}
