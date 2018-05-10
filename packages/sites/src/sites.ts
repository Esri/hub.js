/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { request, IRequestOptions } from "@esri/arcgis-rest-request";
import { IItem } from "@esri/arcgis-rest-common-types";
import { getItem, getItemData } from "@esri/arcgis-rest-items";
import { IInitiative, IInitiativeItem } from "@esri/hub-common-types";

/**
 * Fetch the domains associated with a Hub Site.
 * @param siteId - Identifier of the Hub Site
 * @param requestOptions - request options that may include authentication
 * @returns A Promise that will resolve with the domains associated with the site.
 */
export function fetchDomains(
  siteId: string,
  requestOptions?: IRequestOptions
): Promise<any> {
  const apiUrl = getHubUrl(requestOptions);
  const url = `${apiUrl}/utilities/domains`;

  const options: IRequestOptions = {
    params: { siteId },
    httpMethod: "GET",
    ...requestOptions
  };

  return request(url, options).then(result => {
    return result;
  });
}

/**
 * Fetch the domains associated with a Hub Site.
 * @param siteId - Identifier of the Hub Site
 * @param requestOptions - request options that may include authentication
 * @returns A Promise that will resolve with the domains associated with the site.
 */
export function fetchDomain(
  siteId: string,
  requestOptions?: IRequestOptions
): Promise<any> {
  return fetchDomains(siteId, requestOptions).then(response => {
    // the response may be an array or a naked object...
    if (response.length > 1) {
      // ok - in this case, it's likely that we have a default domain and a custom domain...
      // we want the one that's custom... i.e. does not contain arcgis.com
      const customEntry = response.reduce((acc: any, entry: any) => {
        if (!entry.domain.includes("arcgis.com")) {
          acc = entry;
        }
        return acc;
      }, null);
      if (customEntry) {
        return customEntry.domain;
      } else {
        // WAT!?! just pick the first one
        return response[0].domain;
      }
    } else {
      return response[0].domain;
    }
  });
}

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
    if (portal.includes("mapsdevext")) {
      url = "https://hubdev.arcgis.com";
    }
    if (portal.includes("mapsqaext")) {
      url = "https://hubqa.arcgis.com";
    }
  }
  return url;
}
