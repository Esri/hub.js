/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import {
  addFeatures,
  IAddFeaturesResult
} from "@esri/arcgis-rest-feature-service";

/**
 * Add an annotation to ArcGIS Hub.
 * @param requestOptions - request options that may include authentication
 * @returns A Promise that will resolve with decorated features from the annotation service for a Hub enabled ArcGIS Online organization.
 */

export function addAnnotations(
  requestOptions: any
): Promise<IAddFeaturesResult> {
  return addFeatures(requestOptions);
}
