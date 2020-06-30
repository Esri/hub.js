/* Copyright (c) 2020 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { IRequestOptions } from "@esri/arcgis-rest-request";
import { processRevertableTasks, IRevertableTaskResult, IModel } from "@esri/hub-common";
import { getSurveyModels } from "./get-survey-models";
import { isPublished } from "../utils/is-published";
import { setAccessRevertable } from "./set-access-revertable";

/**
 * Sets eligible Survey items to the provided access
 * @param {IModel} formModel A Form model
 * @param {string} access The desired access
 * @param {IrequestOptions} requestOptions 
 * @returns {Promise<any[]>}
 */
export const setAccess = (
  formModel: IModel,
  access: "private" | "public" | "org",
  requestOptions: IRequestOptions
): Promise<any[]> => {
  return getSurveyModels(formModel, requestOptions)
    .then(({ form, featureService, fieldworker }) => {
      const modelsToChangeAccess = [form, featureService];
      if (isPublished(formModel.item)) {
        modelsToChangeAccess.push(fieldworker);
      }
      const toRevertablePromise = (memo: Promise<IRevertableTaskResult>[], model: IModel) => {
        if (model) {
          memo.push(
            setAccessRevertable(
              model,
              access,
              requestOptions
            )
          );
        }
        return memo;
      };
      const revertableTasks = modelsToChangeAccess.reduce(toRevertablePromise, []);
      return processRevertableTasks(revertableTasks);
    })
    .catch(() => {
      throw new Error(`Failed to set survey ${formModel.item.id} items access to ${access}`);
    });
};
