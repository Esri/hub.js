/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import {
  updateFeatures,
  IUpdateFeaturesRequestOptions,
  IUpdateFeaturesResult
} from "@esri/arcgis-rest-feature-service";

/**
 * Update an annotation in ArcGIS Hub.
 * @param requestOptions - request options that may include authentication
 * @returns A Promise that will resolve with the response from the server.
 */

export function updateAnnotations(
  requestOptions: IUpdateFeaturesRequestOptions
): Promise<IUpdateFeaturesResult> {
  return updateFeatures(requestOptions);
}
