/* Copyright (c) 2020 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { IRequestOptions } from "@esri/arcgis-rest-request";
import { processRevertableTasks, IRevertableTaskResult, IModel } from "@esri/hub-common";
import { getSurveyModels } from "../items/get-survey-models";
import { isPublished } from "../utils/is-published";
import { setAccessRevertable } from "./set-access-revertable";

/**
 * Sets eligible Survey items to the provided access
 * @param {string} formId A Form ID
 * @param {string} access The desired access
 * @param {IrequestOptions} requestOptions 
 * @returns {Promise<any[]>}
 */
export const setAccess = (
  formId: string,
  access: "private" | "public" | "org",
  requestOptions: IRequestOptions
): Promise<any[]> => {
  return getSurveyModels(formId, requestOptions)
    .then(({ form, fieldworker }) => {
      const modelsToChangeAccess = [form];
      if (isPublished(form.item)) {
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
      throw new Error(`Failed to set survey ${formId} items access to ${access}`);
    });
};
