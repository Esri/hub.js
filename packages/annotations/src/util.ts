/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { IRequestOptions } from "@esri/arcgis-rest-request";
import { searchItems, ISearchResult, IItem } from "@esri/arcgis-rest-portal";
import { IEditFeatureResult } from "@esri/arcgis-rest-feature-layer";

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

export interface IEditFeatureError {
  code: string | number;
  description: string;
}

export interface IEditFeatureErrorResponse {
  success: boolean;
  error: IEditFeatureError;
}

export class AllResultsError extends Error {
  errors: IEditFeatureError[];

  constructor(errors: IEditFeatureError[]) {
    super("All attempted edits failed");
    this.errors = errors;
    const message = errors[0].description;
    if (errors.every(error => error.description === message)) {
      // all errors have the same message, use that instead
      this.message = message;
    }
  }
}

/**
 * If all results failed, throw an error
 * otherwise return the results
 * @param results
 */
export function checkResults(
  results: Array<IEditFeatureErrorResponse | IEditFeatureResult>
) {
  const errors: IEditFeatureError[] = [];
  results.reduce((acc, result) => {
    if (!result.success) {
      acc.push((result as IEditFeatureErrorResponse).error);
    }
    return acc;
  }, errors);
  if (errors.length === results.length) {
    throw new AllResultsError(errors);
  }
  return results;
}
