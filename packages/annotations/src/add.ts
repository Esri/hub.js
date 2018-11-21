/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { UserSession } from "@esri/arcgis-rest-auth";

import {
  addFeatures,
  IAddFeaturesRequestOptions,
  IAddFeaturesResult
} from "@esri/arcgis-rest-feature-service";

import { IFeature } from "@esri/arcgis-rest-common-types";

export interface IAnnoFeature extends IFeature {
  attributes: {
    target: string;
    description: string;
    [key: string]: any;
  };
}
export interface IAddAnnotationsRequestOptions
  extends IAddFeaturesRequestOptions {
  adds: IAnnoFeature[];
}

/**
 * ```js
 * import { addAnnotations } from "@esri/hub-annotations";
 * addAnnotations({
 *   url: annotationsUrl + "/0",
 *   adds: [{
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
 * @returns A Promise that will resolve with response from the service after attempting to add one or more new annotations.
 */
export function addAnnotations(
  requestOptions: IAddAnnotationsRequestOptions
): Promise<IAddFeaturesResult> {
  requestOptions.adds.forEach(function(anno) {
    const defaults = {
      status: "pending",
      source: "hub.js"
    };

    // mixin, giving precedence to what was passed to the method
    anno.attributes = {
      ...defaults,
      ...anno.attributes
    };
  });

  return addFeatures(requestOptions);
}
