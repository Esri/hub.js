/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { IRequestOptions } from "@esri/arcgis-rest-request";

/**
 * Based on the request options, return the hub api url
 * @param requestOptions - Request options that may have authentication manager
 * @returns string that is the url for the Hub instance
 */
export function getHubUrl(requestOptions?: IRequestOptions): string {
  let url = "https://hub.arcgis.com";
  if (requestOptions && requestOptions.authentication) {
    // get the portalUrl...
    const portal = requestOptions.authentication.portal;
    // check for devext and qaext in the portal url
    if (portal.includes("mapsdev") || portal.includes("devext")) {
      url = "https://hubdev.arcgis.com";
    }
    if (portal.includes("mapsqa") || portal.includes("qaext")) {
      url = "https://hubqa.arcgis.com";
    }
  }
  return url;
}
