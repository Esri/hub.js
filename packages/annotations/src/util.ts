/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { IRequestOptions } from "@esri/arcgis-rest-request";
import { searchItems, ISearchResult, IItem } from "@esri/arcgis-rest-portal";

export interface IAnnoSearchResult extends ISearchResult<IItem> {
  results: IAnnoItem[];
}

export interface IAnnoItem extends IItem {
  // overrides url?: string
  url: string;
}

/**
 * ```js
 * import { request } from "@esri/arcgis-rest-request";
 * import { getAnnotationServiceUrl } from "@esri/hub-events";
 * // org ids can be retrieved via a call to portals/self
 * request("http://custom.maps.arcgis.com/sharing/rest/portals/self")
 *   .then(response => {
 *     getAnnotationServiceUrl(response.id)
 *       .then(url)
 *   })
 * ```
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
    q: `typekeywords:hubAnnotationLayer AND orgid:${orgId}`,
    // mixin requestOptions (if present)
    ...requestOptions
  }).then((response: ISearchResult<IItem>) => {
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
