/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import {
  request,
  IRequestOptions,
  getPortalUrl
} from "@esri/arcgis-rest-request";
import { IItem } from "@esri/arcgis-rest-common-types";
import { searchItems, ISearchResult } from "@esri/arcgis-rest-items";
import { IQueryFeaturesRequestOptions } from "@esri/arcgis-rest-feature-service";

export interface IAnnoSearchResult extends ISearchResult {
  results: IAnnoItem[];
}

export interface IAnnoItem extends IItem {
  // safe to expect a url
  url: string;
}

/**
 * Fetch the annotations associated with a Hub Site.
 * @param orgId - Identifier of the ArcGIS Online Organization
 * @param requestOptions - request options that may include authentication
 * @returns A Promise that will resolve with an annotations url for a Hub enabled ArcGIS Online organization.
 */
export function getAnnotationServiceUrl(
  orgId: string,
  requestOptions?: IRequestOptions
): Promise<string> {
  return searchItems({
    searchForm: { q: `typekeywords:hubAnnotationLayer AND orgid:${orgId}` },
    // mixin requestOptions (if present)
    ...requestOptions
  }).then(response => {
    const annoResponse = response as IAnnoSearchResult;
    if (annoResponse.results && annoResponse.results.length > 0) {
      // this will need to be smarter if there is more than one service
      let url = annoResponse.results[0].url;
      // force https
      url = url.replace(/^http:/gi, "https:");

      return new Promise<string>((resolve, reject) => {
        resolve(url);
      });
    } else {
      return new Promise<string>((resolve, reject) => {
        reject(
          "No annotation service found. Commenting is likely not enabled."
        );
      });
    }
  });
}
