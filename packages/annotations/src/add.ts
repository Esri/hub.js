/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import {
  addFeatures,
  IAddFeaturesOptions
} from "@esri/arcgis-rest-feature-layer";

import { IFeature } from "@esri/arcgis-rest-types";
import { IEditFeatureResult } from "@esri/arcgis-rest-feature-layer";
import { checkResults, IEditFeatureErrorResponse } from "./util";

export interface IAnnoFeature extends IFeature {
  attributes: {
    target: string;
    description: string;
    [key: string]: any;
  };
}

export interface IAddAnnotationsOptions extends IAddFeaturesOptions {
  features: IAnnoFeature[];
}

/**
 * ```js
 * import { addAnnotations } from "@esri/hub-annotations";
 * //
 * addAnnotations({
 *   url: annotationsUrl + "/0",
 *   features: [{
 *     attributes: {
 *       target: "http://...", // required, explains what is being commented on
 *       description: "A grand idea!" // also required. this is the actual comment
 *     }
 *   }]
 * })
 *   .then(response);
 * ```
 * Add an annotation to ArcGIS Hub. Uses authentication to derive authorship, appends a timestamp and sets a default status of "pending" to new comments by default.
 * @param requestOptions - request options that may include authentication
 * @returns A Promise that will resolve with the response from the service after attempting to add one or more new annotations.
 */
export function addAnnotations(
  requestOptions: IAddAnnotationsOptions
): Promise<{
  addResults?: Array<IEditFeatureErrorResponse | IEditFeatureResult>;
}> {
  /* istanbul ignore else */
  if (requestOptions.features && requestOptions.features.length) {
    requestOptions.features.forEach(anno => enrichAnnotation(anno));
  }

  return addFeatures(requestOptions).then(response => {
    return {
      ...response,
      addResults: checkResults(response.addResults)
    };
  });
}

function enrichAnnotation(annotation: IAnnoFeature) {
  const defaults = {
    status: "pending",
    source: "hub.js"
  };

  // mixin, giving precedence to what was passed to the method
  annotation.attributes = {
    ...defaults,
    ...annotation.attributes
  };
}
