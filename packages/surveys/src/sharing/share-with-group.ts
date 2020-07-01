/* Copyright (c) 2020 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { IRequestOptions } from "@esri/arcgis-rest-request";
import { processRevertableTasks } from "@esri/hub-common";
import { getGroupSharingDetails } from "./get-group-sharing-details";
import { shareWithGroupRevertable } from "./share-with-group-revertable";

/**
 * Shares eligible Survey items for the provided formId
 * with the provided groupId
 * @param {string} formId A Form ID
 * @param {string} groupId A group ID
 * @param {IRequestOptions} requestOptions The request options
 * @returns {Promise<any[]>}
 */
export const shareWithGroup = (
  formId: string,
  groupId: string,
  requestOptions: IRequestOptions
): Promise<any[]> => {
  return getGroupSharingDetails(formId, groupId, requestOptions)
    .then(({ modelsToShare, group }) => {
      const revertableTasks = modelsToShare.map(
        (model) => shareWithGroupRevertable(
          model,
          group,
          requestOptions
        )
      );
      return processRevertableTasks(revertableTasks);;
    })
    .catch(() => {
      throw new Error(`Failed to share survey ${formId} items to group ${groupId}`);
    });
};
