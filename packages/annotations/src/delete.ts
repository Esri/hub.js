/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import {
  deleteFeatures,
  IDeleteFeaturesRequestOptions,
  IDeleteFeaturesResult
} from "@esri/arcgis-rest-feature-service";

/**
 * Delete an annotation from ArcGIS Hub.
 * @param requestOptions - request options that may include authentication
 * @returns A Promise that will resolve with response from the service after attempting to delete annotations.
 */

export function deleteAnnotations(
  requestOptions: IDeleteFeaturesRequestOptions
): Promise<IDeleteFeaturesResult> {
  return deleteFeatures(requestOptions);
}
