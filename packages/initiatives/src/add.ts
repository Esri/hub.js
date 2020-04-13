/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { IInitiativeModel, IModel } from "@esri/hub-common";
import { IRequestOptions } from "@esri/arcgis-rest-request";
import { saveModel, updateModel } from "./model";
import { getHubApiUrl } from "@esri/hub-common";

export const INITIATIVE_TYPE_NAME = "Hub Initiative";

/**
 * Save an Initiative model. If the model does not have an item.id
 * we will create a new item. Otherwise we update the existing item.
 * Returns the same model instance, with the item.id assigned;
 *
 * @export
 * @param {IInitiativeModel} model
 * @param {IRequestOptions} requestOptions
 * @returns {Promise<IInitiativeModel>}
 */
export function addInitiative(
  model: IInitiativeModel,
  requestOptions: IRequestOptions
): Promise<IModel> {
  // delegate to model to do the save...
  return saveModel(model, requestOptions);
}

/**
 * Generate the default url for an Initiative - which is the route to the
 * initiative in the admin app
 *
 * @export
 * @param {string} itemId
 * @param {IRequestOptions} requestOptions
 * @returns {string} Url to the initiative in the admin app
 */
export function getInitiativeUrl(
  itemId: string,
  requestOptions?: IRequestOptions
): string {
  return `${getHubApiUrl(requestOptions)}/admin/initiatives/${itemId}`;
}
