import { IRequestOptions, getPortalUrl } from "@esri/arcgis-rest-request";

/**
 * @param requestOptions - request options that may include authentication
 */
export function getHubRESTAPIBaseUrl(requestOptions: IRequestOptions): string {
  const portalUrl = getPortalUrl(requestOptions);
  if (portalUrl.match(/(qaext|\.mapsqa\.)/)) {
    return "https://hubqa.arcgis.com";
  } else if (portalUrl.match(/(devext|\.mapsdevext\.)/)) {
    return "https://hubdev.arcgis.com";
  } else if (portalUrl.match(/(www|\.maps\.)/)) {
    return "https://hub.arcgis.com";
  } else return undefined;
}
