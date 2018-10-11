/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { IRequestOptions } from "@esri/arcgis-rest-request";
import { IItem } from "@esri/arcgis-rest-common-types";
import { searchItems, ISearchResult } from "@esri/arcgis-rest-items";

export interface IEventSearchResult extends ISearchResult {
  results: IEventItem[];
}

export interface IEventItem extends IItem {
  // overrides url?: string
  url: string;
}

/**
 * Fetch the events service associated with a Hub Site.
 * @param orgId - Identifier of the ArcGIS Online Organization
 * @param requestOptions - request options that may include authentication
 * @returns A Promise that will resolve with an events url for a Hub enabled ArcGIS Online organization.
 */
export function getEventServiceUrl(
  orgId: string,
  requestOptions?: IRequestOptions
): Promise<string> {
  return searchItems({
    searchForm: { q: `typekeywords:hubEventsLayer AND orgid:${orgId}` },
    // mixin requestOptions (if present)
    ...requestOptions
  }).then(response => {
    const eventResponse = response as IEventSearchResult;
    if (eventResponse.results && eventResponse.results.length > 0) {
      let result;
      if (eventResponse.results.length === 1) {
        // user only has access to the public view
        result = eventResponse.results[0];
      } else if (eventResponse.results.length > 1) {
        // the user has access to the org view and/or the admin view
        // identify which is which
        const obj = eventResponse.results.reduce((acc: any, item: any) => {
          if (!item.typeKeywords.includes("View Service")) {
            acc.admin = item;
          } else {
            if (item.access === "public") {
              acc.public = item;
            } else {
              acc.org = item;
            }
          }
          return acc;
        }, {});
        // pick the highest access level that this user has access to
        result = obj.admin || obj.org || obj.public;
      }
      // single-layer service
      let url = `${result.url}/0`;
      // force https
      url = url.replace(/^http:/gi, "https:");
      return url;
    } else {
      throw Error("No events service found. Events are likely not enabled.");
    }
  });
}
