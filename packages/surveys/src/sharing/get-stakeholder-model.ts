/* Copyright (c) 2020 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { IRequestOptions } from "@esri/arcgis-rest-request";
import { getRelatedItems } from "@esri/arcgis-rest-portal";
import { IFeatureServiceItem, IFeatureServiceModel } from "@esri/hub-common";
import { isFieldworkerView } from "../utils/is-fieldworker-view";

/**
 * Fetches a Survey's Stakeholder View for a given
 * Fieldworker View ID
 * @param {string} fieldworkerId The Fieldworker View ID
 * @param {IRequestOptions} requestOptions The request options
 * @returns {Promise<IFeatureServiceModel>}
 */
export const getStakeholderModel = (
  fieldworkerId: string,
  requestOptions: IRequestOptions
): Promise<IFeatureServiceModel> => {
  return getRelatedItems({
    id: fieldworkerId,
    relationshipType: "Service2Service",
    direction: "forward",
    ...requestOptions
  })
    .then(({ relatedItems }) => {
      const [featureService] = relatedItems.filter(
        service => !isFieldworkerView(service as IFeatureServiceItem)
      );
      let model;

      if (featureService) {
        model = { item: featureService as IFeatureServiceItem };
      }

      return model;
    });
};
