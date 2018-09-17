/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { IRequestOptions } from "@esri/arcgis-rest-request";
import { IFeature } from "@esri/arcgis-rest-common-types";

import {
  updateFeatures,
  IUpdateFeaturesRequestOptions,
  IUpdateFeaturesResult
} from "@esri/arcgis-rest-feature-service";

export interface IUpdateAnnotationsRequestOptions extends IRequestOptions {
  /**
   * Feature service url.
   */
  url: string;
  /**
   * Array of JSON features to update.
   */
  annotations: IFeature[];
}

/**
 * Update an annotation in ArcGIS Hub, appending a `created_at` timestamp internally.
 * @param requestOptions - request options that may include authentication
 * @returns A Promise that will resolve with response from the service after attempting to update one or more annotations.
 */
export function updateAnnotations(
  requestOptions: IUpdateAnnotationsRequestOptions
): Promise<IUpdateFeaturesResult> {
  let options: IUpdateFeaturesRequestOptions = {
    updates: requestOptions.annotations,
    ...requestOptions
  };

  delete options.annotations;

  options.updates.forEach(function(anno: IFeature) {
    const defaults = {
      updated_at: new Date().getTime()
    };

    // mixin, giving precedence to what was passed to the method
    anno.attributes = {
      ...defaults,
      ...anno.attributes
    };
  });

  return updateFeatures(options);
}
