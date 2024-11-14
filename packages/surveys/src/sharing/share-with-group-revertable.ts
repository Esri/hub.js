/* Copyright (c) 2020 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { ArcGISIdentityManager, IRequestOptions } from "@esri/arcgis-rest-request";
import {
  unshareItemWithGroup,
  shareItemWithGroup,
  IGroup
} from "@esri/arcgis-rest-portal";
import {
  IModel,
  IRevertableTaskResult,
  runRevertableTask,
  isUpdateGroup
} from "@esri/hub-common";

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
  const authentication = requestOptions.authentication as ArcGISIdentityManager;
  return runRevertableTask(
    () =>
      shareItemWithGroup({
        id,
        owner,
        groupId,
        confirmItemControl: isUpdateGroup(group),
        authentication
      }).then(result => {
        if (result.notSharedWith.length) {
          throw new Error(`Failed to share item ${id} to group ${groupId}`);
        }
        return result;
      }),
    () =>
      /* tslint:disable no-empty */
      unshareItemWithGroup({
        id,
        owner,
        groupId,
        authentication
      }).catch(() => { })
    /* tslint:enable no-empty */
  );
};
