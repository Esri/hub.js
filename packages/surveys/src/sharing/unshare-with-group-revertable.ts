/* Copyright (c) 2020 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { IRequestOptions } from "@esri/arcgis-rest-request";
import { UserSession } from "@esri/arcgis-rest-auth";
import {
  unshareItemWithGroup,
  shareItemWithGroup
} from "@esri/arcgis-rest-portal";
import { IGroup } from "@esri/arcgis-rest-types";
import {
  IModel,
  IRevertableTaskResult,
  runRevertableTask,
  isUpdateGroup
} from "@esri/hub-common";

/**
 * A revertable task for unsharing eligible Survey items
 * from an IGroup
 * @param {IModel} model The IModel of the survey to unshare
 * @param {IGroup} group The Group to unshare the Form items from
 * @param {IRequestOptions} requestOptions The request options
 * @returns {Promise<IRevertableTaskResult>}
 */
export const unshareWithGroupRevertable = (
  model: IModel,
  group: IGroup,
  requestOptions: IRequestOptions
): Promise<IRevertableTaskResult> => {
  const { id, owner, access: itemAccess } = model.item;
  const { id: groupId } = group;
  const authentication = requestOptions.authentication as UserSession;
  return runRevertableTask(
    () =>
      unshareItemWithGroup({
        id,
        owner,
        groupId,
        authentication
      }).then(result => {
        if (result.notUnsharedFrom.length) {
          throw new Error(`Failed to unshare item ${id} from group ${groupId}`);
        }
        return result;
      }),
    () =>
      /* tslint:disable no-empty */
      shareItemWithGroup({
        id,
        owner,
        groupId,
        confirmItemControl: isUpdateGroup(group),
        authentication
      }).catch(() => {})
    /* tslint:enable no-empty */
  );
};
