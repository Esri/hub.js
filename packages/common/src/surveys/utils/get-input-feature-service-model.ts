/* Copyright (c) 2020 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { IRequestOptions } from "@esri/arcgis-rest-request";
import { getRelatedItems } from "@esri/arcgis-rest-portal";
import { IModel } from "../../types";

/**
 * Gets the primary input Feature Service for the given
 * Form ID. This will be the Fieldworker view, if it exists,
 * otherwise the source Feature Service.
 * @param {string} formId The Form ID
 * @param requestOptions The request options
 * @returns {Promise<IModel>}
 */
export const getInputFeatureServiceModel = (
  formId: string,
  requestOptions: IRequestOptions
): Promise<IModel> => {
  return getRelatedItems({
    id: formId,
    relationshipType: "Survey2Service",
    direction: "forward",
    ...requestOptions,
  }).then(({ relatedItems: [featureService] }) => {
    let model;
    if (featureService) {
      model = { item: featureService };
    }
    return model;
  });
};
