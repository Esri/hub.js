/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { IRequestOptions } from "@esri/arcgis-rest-request";
import { updateModel } from "./model";
import { IInitiativeModel } from "@esri/hub-common";

/**
 * Update an existing Initiative Model
 * @param model
 * @param requestOptions
 * @returns {Promise<IInitiativeModel>}
 */
export function updateInitiative(
  model: IInitiativeModel,
  requestOptions: IRequestOptions
): Promise<IInitiativeModel> {
  return updateModel(model, requestOptions) as Promise<IInitiativeModel>;
}
