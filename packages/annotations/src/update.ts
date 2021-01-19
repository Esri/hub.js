/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import {
  updateFeatures,
  IUpdateFeaturesOptions
} from "@esri/arcgis-rest-feature-layer";
import { IEditFeatureResult } from "@esri/arcgis-rest-feature-layer";
import { checkResults, IEditFeatureErrorResponse } from "./util";

/**
 * ```js
 * import { updateAnnotations } from "@esri/hub-annotations";
 * //
 * updateAnnotations({
 *   url: annotationsUrl + "/0",
 *   features: [{
 *     attributes: {
 *       // an ID is necessary to determine which feature to update
 *       OBJECTID: 1,
 *       status: "approved"
 *     }
 *   }]
 * })
 *   .then(response);
 * ```
 * Update an annotation in ArcGIS Hub.
 * @param requestOptions - request options that may include authentication
 * @returns A Promise that will resolve with the response from the service after attempting to update one or more annotations.
 */

export function updateAnnotations(
  requestOptions: IUpdateFeaturesOptions
): Promise<{
  updateResults?: Array<IEditFeatureErrorResponse | IEditFeatureResult>;
}> {
  return updateFeatures(requestOptions).then(response => {
    return {
      ...response,
      updateResults: checkResults(response.updateResults)
    };
  });
}
