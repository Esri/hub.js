/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import {
  updateFeatures,
  IUpdateFeaturesRequestOptions,
  IUpdateFeaturesResult
} from "@esri/arcgis-rest-feature-service";

/**
 * Update an annotation in ArcGIS Hub, appending a `created_at` timestamp internally.
 * @param requestOptions - request options that may include authentication
 * @returns A Promise that will resolve with response from the service after attempting to update one or more annotations.
 */

export function updateAnnotations(
  requestOptions: IUpdateFeaturesRequestOptions
): Promise<IUpdateFeaturesResult> {
  requestOptions.updates.forEach(function(anno) {
    const defaults = {
      updated_at: new Date().getTime()
    };

    // mixin, giving precedence to what was passed to the method
    anno.attributes = {
      ...defaults,
      ...anno.attributes
    };
  });

  return updateFeatures(requestOptions);
}
