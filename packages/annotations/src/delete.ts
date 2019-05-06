/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import {
  deleteFeatures,
  IDeleteFeaturesOptions
} from "@esri/arcgis-rest-feature-layer";
import { IEditFeatureResult } from "@esri/arcgis-rest-feature-layer";
/**
 * ```js
 * import { deleteAnnotations } from "@esri/hub-annotations";
 * //
 * deleteAnnotations({
 *   url: annotationsUrl + "/0",
 *   // an array of featureIds
 *   objectIds: [ 1 ]
 * })
 *   .then(response);
 * ```
 *
 * Delete an annotation from ArcGIS Hub.
 * @param requestOptions - request options that may include authentication
 * @returns A Promise that will resolve with the response from the service after attempting to delete annotations.
 */

export function deleteAnnotations(
  requestOptions: IDeleteFeaturesOptions
): Promise<{ deleteResults?: IEditFeatureResult[] }> {
  return deleteFeatures(requestOptions);
}
