/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { IRequestOptions } from "@esri/arcgis-rest-request";
import { IFormModel, processRevertableTasks } from "@esri/hub-common";
import { getGroupSharingDetails } from "./get-group-sharing-details";
import { unshareWithGroupRevertable } from "./unshare-with-group-revertable";

/**
 * Unshares eligible Survey items for the provided IFormModel
 * from the provided groupId
 * @param {IFormModel} formModel A Form model
 * @param {string} groupId A group ID
 * @param {IRequestOptions} requestOptions The request options
 * @returns {Promise<any[]>}
 */
export const unshareWithGroup = (
  formModel: IFormModel,
  groupId: string,
  requestOptions: IRequestOptions
): Promise<any[]> => {
  return getGroupSharingDetails(formModel, groupId, requestOptions)
    .then(({ modelsToShare, group }) => {
      const revertableTasks = modelsToShare.map(
        (model) => unshareWithGroupRevertable(
          model,
          group,
          requestOptions
        )
      );
      return processRevertableTasks(revertableTasks);
    })
    .catch(() => {
      throw new Error(`Failed to unshare survey ${formModel.item.id} items with group ${groupId}`);
    });
};
