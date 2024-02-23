/* Copyright (c) 2020 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { IRequestOptions } from "@esri/arcgis-rest-request";
import { getItem, IItem } from "@esri/arcgis-rest-portal";
import { IModel, IGetSurveyModelsResponse } from "../../types";
import { getInputFeatureServiceModel } from "./get-input-feature-service-model";
import { getSourceFeatureServiceModelFromFieldworker } from "./get-source-feature-service-model-from-fieldworker";
import { getStakeholderModel } from "./get-stakeholder-model";
import { isFieldworkerView } from "./is-fieldworker-view";

/**
 * Builds a dictionary of Survey items for the given Form model
 * @param {string} formId The Form ID of the survey
 * @param {IRequestOptions} requestOptions The request options
 * @returns {Promise<IGetSurveyModelsResponse>}
 */
export const getSurveyModels = (
  formItemOrId: string | IItem,
  requestOptions: IRequestOptions
): Promise<IGetSurveyModelsResponse> => {
  let fieldworker: IModel;
  let stakeholder: IModel;

  const getForm = () =>
    typeof formItemOrId === "string"
      ? getItem(formItemOrId, requestOptions)
      : Promise.resolve(formItemOrId);

  return getForm().then((form) => {
    const promises: Array<Promise<IModel>> = [
      // the primary input will be the fieldworker (if it exists), otherwise
      // the source feature service.
      getInputFeatureServiceModel(form.id, requestOptions),
      getStakeholderModel(form.id, requestOptions),
    ];

    return Promise.all(promises)
      .then(([featureServiceOrFieldworkerModelResult, stakeholderResult]) => {
        stakeholder = stakeholderResult;

        if (
          featureServiceOrFieldworkerModelResult &&
          isFieldworkerView(featureServiceOrFieldworkerModelResult.item)
        ) {
          fieldworker = featureServiceOrFieldworkerModelResult;
          // if the primary input is the fieldworker, fetch
          // the source feature service
          return getSourceFeatureServiceModelFromFieldworker(
            fieldworker.item.id,
            requestOptions
          );
        } else {
          return featureServiceOrFieldworkerModelResult;
        }
      })
      .then((featureService) => {
        return {
          form: { item: form },
          featureService,
          fieldworker,
          stakeholder,
        };
      });
  });
};
