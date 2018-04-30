/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { request, IRequestOptions } from "@esri/arcgis-rest-request";
import { IItem } from "@esri/arcgis-rest-common-types";
import { getItem, getItemData } from "@esri/arcgis-rest-items";

export interface IInitiativeRequestOptions extends IRequestOptions {
  /**
   * Set this value to false to avoid making a web request to fetch the item's data.
   */
  data: boolean;
}

/**
 * Get the initiative item + data in one call
 * @param id - Initiative Item Id
 * @param requestOptions - Initiative request options that may have authentication manager
 * @returns A Promise that will resolve with the Initiative item and data
 */
export function fetchInitiative(
  id: string,
  requestOptions?: IInitiativeRequestOptions
): Promise<any> {
  if (requestOptions && !requestOptions.data) {
    return getItem(id, requestOptions);
  } else {
    return Promise.all([
      getItem(id, requestOptions),
      getItemData(id, requestOptions)
    ]).then(result => {
      // shape this into a model
      return {
        item: result[0],
        data: result[1]
      };
    });
  }
}

/**
 * Get site url for Initiative
 * Get the initiative item. If it has a site, it will have item.properties.siteId
 * From there, we can use the domain service to lookup the domain using the siteId
 * @param id - Initiative Item Id
 * @param requestOptions - Request options that may have authentication manager
 * @returns A Promise that will resolve with the Initiative site's domain. Consumer needs to add the protocol
 */
export function lookupSiteUrlByInitiative(
  id: string,
  requestOptions?: IRequestOptions
): Promise<string> {
  return getItem(id, requestOptions).then(initiative => {
    if (initiative.properties.siteId) {
      const apiUrl = getHubUrl(requestOptions);
      const url = `${apiUrl}/utilities/domains?siteId=${
        initiative.properties.siteId
      }`;

      return fetch(url)
        .then(response => {
          return response.json();
        })
        .then(response => {
          // the response may be an array or a naked object...
          if (response.length > 1) {
            // ok - in this case, it's likely that we have a default domain and a custom domain...
            // we want the one that's custom... i.e. does not contain arcgis.com
            const customEntry = response.reduce((acc: any, entry: any) => {
              if (entry.domain.indexOf("arcgis.com") === -1) {
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
    } else {
      // reject
      return Promise.reject(
        new Error("Initiative does not have an associated site")
      );
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
    if (portal.indexOf("mapsdevext") > -1) {
      url = "https://hubdev.arcgis.com";
    }
    if (portal.indexOf("mapsqaext") > -1) {
      url = "https://hubqa.arcgis.com";
    }
  }
  return url;
}
