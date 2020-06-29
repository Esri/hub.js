/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { IRequestOptions } from "@esri/arcgis-rest-request";
import { getRelatedItems } from "@esri/arcgis-rest-portal";
import { IFeatureServiceItem, IFeatureServiceModel } from "@esri/hub-common";

/**
 * Fetches a Survey's source Feature Service from a given
 * Fieldworker View ID
 * @param {string} fieldworkerId The Fieldworker View ID
 * @param {IRequestOptions} requestOptions The request options
 * @returns {Promise<IFeatureServiceModel>}
 */
export const getSourceFeatureServiceModelFromFieldworker = (
  fieldworkerId: string,
  requestOptions: IRequestOptions
): Promise<IFeatureServiceModel> => {
  return getRelatedItems({
    id: fieldworkerId,
    relationshipType: "Service2Data",
    direction: "forward",
    ...requestOptions
  })
    .then(({ relatedItems: [featureService] }) => {
      let model;
      if (featureService) {
        model = { item: featureService as IFeatureServiceItem };
      }
      return model;
    });
};
