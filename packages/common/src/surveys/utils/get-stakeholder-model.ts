/* Copyright (c) 2020 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { IRequestOptions } from "@esri/arcgis-rest-request";
import { getRelatedItems } from "@esri/arcgis-rest-portal";
import { IModel } from "../../types";

/**
 * Fetches a Survey's Stakeholder View for a given
 * Form ID
 * @param {string} formId A Form ID
 * @param {IRequestOptions} requestOptions The request options
 * @returns {Promise<IModel>}
 */
export const getStakeholderModel = (
  formId: string,
  requestOptions: IRequestOptions
): Promise<IModel> => {
  return getRelatedItems({
    id: formId,
    relationshipType: "Survey2Data",
    direction: "forward",
    ...requestOptions,
  }).then(({ relatedItems: [stakeholderView] }) => {
    let model;
    if (stakeholderView) {
      model = { item: stakeholderView } as IModel;
    }
    return model;
  });
};
