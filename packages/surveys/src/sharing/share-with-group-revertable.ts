/* Copyright (c) 2020 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { IRequestOptions } from "@esri/arcgis-rest-request";
import { UserSession } from "@esri/arcgis-rest-auth";
import { unshareItemWithGroup, shareItemWithGroup } from "@esri/arcgis-rest-portal";
import { IGroup } from "@esri/arcgis-rest-types";
import { IModel, IRevertableTaskResult, runRevertableTask, isUpdateGroup } from "@esri/hub-common";

/**
 * A revertable task for sharing eligible Survey items
 * with an IGroup
 * @param {IModel} model The IModel of the survey to share
 * @param {IGroup} group The Group to share the Form items to
 * @param {IRequestOptions} requestOptions The request options
 * @returns {Promise<IRevertableTaskResult>}
 */
export const shareWithGroupRevertable = (
  model: IModel,
  group: IGroup,
  requestOptions: IRequestOptions
): Promise<IRevertableTaskResult> => {
  const { id, owner, access: itemAccess } = model.item;
  const { id: groupId } = group;
  const authentication = requestOptions.authentication as UserSession;
  return runRevertableTask(
    () => shareItemWithGroup({
      id,
      owner,
      groupId,
      confirmItemControl: isUpdateGroup(group),
      authentication
    })
      .then((result) => {
        if (result.notSharedWith.length) {
          throw new Error(`Failed to share item ${id} to group ${groupId}`);
        }
        return result;
      }),
    () => unshareItemWithGroup({
      id,
      owner,
      groupId,
      authentication
    })
      .catch(() => {})
  );
};
