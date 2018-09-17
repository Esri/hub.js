/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */
import { IRequestOptions } from "@esri/arcgis-rest-request";
import { IModel, cloneObject } from "@esri/hub-common";
import geometryService from "./geometry";
import {
  createItem,
  updateItem,
  IItemUpdateRequestOptions,
  IItemAddRequestOptions
} from "@esri/arcgis-rest-items";

/**
 * Save an IModel. Generic function that will be used across all
 * type-specific save functions
 *
 * @export
 * @param {IModel} "model" object (i.e. `{item:{...}, data:{...}}`)
 * @param {IRequestOptions} requestOptions
 * @returns {Promise<IModel>}
 */
export function saveModel(
  model: IModel,
  requestOptions: IRequestOptions
): Promise<IModel> {
  const clone = cloneObject(model) as IModel;
  const opts = createRequestOptions(clone, requestOptions);
  return createItem(opts as IItemAddRequestOptions).then(response => {
    clone.item.id = response.id;
    return clone as IModel;
  });
}
/**
 * Update an IModel. Generic function that will be used across all
 * type-specific update functions
 *
 * @export
 * @param {IModel} "model" object (i.e. `{item:{...}, data:{...}}`)
 * @param {IRequestOptions} requestOptions
 * @returns {Promise<IModel>}
 */
export function updateModel(
  model: IModel,
  requestOptions: IRequestOptions
): Promise<IModel> {
  const clone = cloneObject(model) as IModel;
  const opts = createRequestOptions(clone, requestOptions);

  return updateItem(opts as IItemUpdateRequestOptions).then(() => {
    // return a new ref to the model that was passed in...
    return clone as IModel;
  });
}

/**
 * Centralize the serialization of an IModel into an object
 * that we can send to the Item methods
 *
 * @param {IModel} model
 * @param {IRequestOptions} requestOptions
 * @returns {*}
 */
function createRequestOptions(
  model: IModel,
  requestOptions: IRequestOptions
): any {
  // construct an object to send to the API
  const item = cloneObject(model.item);
  item.data = cloneObject(model.data);

  // create the options...
  const opts = {
    item,
    ...requestOptions
  };
  return opts;
}

export interface IProjectExtentOptions {
  extent: any;
  portal?: any;
}

/**
 * Given an extent, project it and return a BBOX lat/long string, which is the format
 * required when creating an item.
 * @param orgExtent Extent to project
 * @param portal
 * @returns {Promise<any>} Promise that will resolve with a bbox string (W,S,E,N)
 */
export function getProjectedExtentAsBBOXString(
  options: IProjectExtentOptions,
  requestOptions: IRequestOptions
): Promise<string> {
  const url = geometryService.getUrl(options.portal);
  return geometryService
    .project(
      url,
      options.extent.spatialReference.wkid,
      4326,
      "esriGeometryEnvelope",
      [options.extent],
      requestOptions
    )
    .then((response: any) => {
      const ext4326 = response.geometries[0];
      return (
        ext4326.xmin +
        "," +
        ext4326.ymin +
        "," +
        ext4326.xmax +
        "," +
        ext4326.ymax
      );
    });
}
