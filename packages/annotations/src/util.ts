/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { IRequestOptions } from "@esri/arcgis-rest-request";
import { IItem } from "@esri/arcgis-rest-common-types";
import { searchItems, ISearchResult } from "@esri/arcgis-rest-items";

export interface IAnnoSearchResult extends ISearchResult {
  results: IAnnoItem[];
}

export interface IAnnoItem extends IItem {
  // overrides url?: string
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
      // it feels like we can/should += '/0' internally here
      return url;
    } else {
      throw Error(
        "No annotation service found. Commenting is likely not enabled."
      );
    }
  });
}
