/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { IRequestOptions } from "@esri/arcgis-rest-request";
import { IFormModel, IGetSurveyModelsResponse, IFeatureServiceModel } from "@esri/hub-common";
import { getInputFeatureServiceModel } from "./get-input-feature-service-model";
import { getSourceFeatureServiceModelFromFieldworker } from "./get-source-feature-service-model-from-fieldworker";
import { getStakeholderModel } from "./get-stakeholder-model";
import { isFieldworkerView } from "../utils/is-fieldworker-view";

/**
 * Builds a dictionary of Survey items for the given IFormModel
 * @param {IFormModel} formModel The Form model of the survey
 * @param {IRequestOptions} requestOptions The request options
 * @returns {Promise<IGetSurveyModelsResponse>}
 */
export const getSurveyModels = (
  formModel: IFormModel,
  requestOptions: IRequestOptions
): Promise<IGetSurveyModelsResponse> => {
  let featureService: IFeatureServiceModel;
  let fieldworker: IFeatureServiceModel;

  // the primary input will be the fieldworker (if it exists), otherwise
  // the source feature service.
  return getInputFeatureServiceModel(
    formModel.item.id,
    requestOptions
  )
    .then((featureServiceOrFieldworkerModelResult) => {
      if (isFieldworkerView(featureServiceOrFieldworkerModelResult.item)) {
        fieldworker = featureServiceOrFieldworkerModelResult;
      } else {
        featureService = featureServiceOrFieldworkerModelResult;
      }

      // if the primary input is the fieldworker, fetch
      // the source feature service
      if (fieldworker) {
        return getSourceFeatureServiceModelFromFieldworker(
          fieldworker.item.id,
          requestOptions
        )
          .then((featureServiceModelResult) => {
            featureService = featureServiceModelResult;
          });
      }
    })
    .then(() => getStakeholderModel(
      featureService.item.id,
      requestOptions
    ))
    .then(stakeholder => {
      return {
        form: formModel,
        featureService,
        fieldworker,
        stakeholder
      };
    });
};
