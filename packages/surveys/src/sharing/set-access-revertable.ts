/* Copyright (c) 2020 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { IRequestOptions } from "@esri/arcgis-rest-request";
import { UserSession } from "@esri/arcgis-rest-auth";
import { setItemAccess } from "@esri/arcgis-rest-portal";
import {
  IModel,
  IRevertableTaskResult,
  runRevertableTask
} from "@esri/hub-common";

/**
 * A revertable task for setting eligible Survey items access
 * @param {IModel} model The IModel of the survey items to set access
 * @param {string} access The access to set
 * @param {IRequestOptions} requestOptions The request options
 * @returns {Promise<IRevertableTaskResult>}
 */
export const setAccessRevertable = (
  model: IModel,
  access: "private" | "org" | "public",
  requestOptions: IRequestOptions
): Promise<IRevertableTaskResult> => {
  const { id, owner, access: itemAccess } = model.item;
  const previousAccess = (itemAccess === "shared" && "private") || itemAccess;
  const authentication = requestOptions.authentication as UserSession;
  return runRevertableTask(
    () =>
      setItemAccess({
        id,
        owner,
        access,
        authentication
      }).then(result => {
        if (result.notSharedWith.length) {
          throw new Error(`Failed to set item ${id} access to ${access}`);
        }
        return result;
      }),
    () =>
      /* tslint:disable no-empty */
      setItemAccess({
        id,
        owner,
        access: previousAccess,
        authentication
      }).catch(() => {})
    /* tslint:enable no-empty */
  );
};
