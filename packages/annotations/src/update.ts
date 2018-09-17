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
 *
 * ````js
 *
 * updateAnnotations({
 *   url,
 *   annotations: [{
 *     attributes: {
 *       OBJECTID: 1,
 *       description: "A grander idea!!!!"
 *     }
 *   }]
 * }).then(response)
 * ```
 *
 * @param requestOptions - request options that may include authentication
 * @returns A Promise that will resolve with response from the service after attempting to update one or more annotations.
 */

export function updateAnnotations(
  requestOptions:
    | IUpdateAnnotationsRequestOptions
    | IUpdateFeaturesRequestOptions
): Promise<IUpdateFeaturesResult> {
  if (isUpdateAnno(requestOptions)) {
    requestOptions = {
      updates: requestOptions.annotations,
      ...requestOptions
    } as IUpdateFeaturesRequestOptions;
  }

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

function isUpdateAnno(
  options: IUpdateAnnotationsRequestOptions | IUpdateFeaturesRequestOptions
): options is IUpdateAnnotationsRequestOptions {
  return (
    (options as IUpdateAnnotationsRequestOptions).annotations !== undefined
  );
}
