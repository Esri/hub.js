/* Copyright (c) 2020 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { IHubRequestOptions, getModel, getFromHubAPI } from "@esri/hub-common";
// TODO: why won't this import from hub-common?
// import { getFromHubAPI } from "../../common/src/api";

import { IModel } from "@esri/hub-common";
import { getCategory } from "@esri/hub-common";
import { IContentModel } from "./index";

/**
 * ```js
 * getContent('3ef...')
 *  .then(contentModel => {
 *    // work with the model
 *  })
 * ```
 * Get the content by unique ID. 
 * This method works to call either the Portal (AGO) API or Hub API
 * and return a common data model.
 *
 *
 * @param id - Content Id
 * @param requestOptions - Tequest options that may have authentication manager
 * @returns A Promise that will resolve with the Content metadata
 * @export
 */
export function getContent(
  id: string,
  hubRequestOptions?: IHubRequestOptions
): Promise<any> {

  if(hubRequestOptions.isPortal) {
    return _getContentFromPortal(id, hubRequestOptions);
  } else {
    return _getContentFromHub(id, hubRequestOptions);
  }
}

/**
 * ```js
 * _getContentFromPortal('3ef...')
 *  .then(contentModel => {
 *    // work with the model
 *  })
 * ```
 * Get the content data from Portal or Online 
 *
 *
 * @param {String} id Content Id
 * @param {IHubRequestOptions} hubRequestOptions Request options that may have authentication manager
 * @returns A Promise that will resolve with the item and data
 * @export
 */
export function _getContentFromPortal(
  id: string,
  hubRequestOptions?: IHubRequestOptions
): Promise<any> {

  return getModel(id, hubRequestOptions).then((item:IModel) => {
    return new Promise(resolve => {
      const content = _convertItemToContent(item);
      resolve(content);
    })
  });
}

/**
 * Convert a Portal Item to a Hub Content 
 * TODO: Change to use mdJSON translation for configurable metadata
 *
 *
 * @param {IModel} item Portal Item
 * @returns {IContentModel} Hub content object
 * @export
 */
export function _convertItemToContent(
  item: IModel
): IContentModel {
  let content:IContentModel = {
    id: item.item.id,
    type: getCategory(item.item.type),
    title: item.item.title,
    summary: item.item.snippet,
    description: item.item.description,
    owner: { username: item.item.owner },

    item: item.item, // Kept for temporary backwards compatibility, but redundant
    data: item.data
  };

  return content;
}

/**
 * ```js
 * _getContentFromHub('3ef...')
 *  .then(contentModel => {
 *    // work with the model
 *  })
 * ```
 * Get the content data from the Hub API
 *
 *
 * @param {String} id Content Id
 * @param {IHubRequestOptions} hubRequestOptions Request options that may have authentication manager
 * @returns A Promise that will resolve with the item and data
 * @export
 */
export function _getContentFromHub(
  id: string,
  hubRequestOptions?: IHubRequestOptions
): Promise<any> {

  return getFromHubAPI(id, hubRequestOptions);
}

/**
 * Convert a Hub v3 Dataset to Hub Content 
 * TODO: Change to use mdJSON translation for configurable metadata
 *
 *
 * @param {IModel} item Hub Item
 * @returns {IContentModel} Hub content object
 * @export
 */
export function _convertv3ToContent(
  hubmodel: any
): IContentModel {
  let content:IContentModel = {
    id: hubmodel.id,
    type: hubmodel.type,
    title: hubmodel.attributes.name,
    summary: "Missing from Hub API v3",
    description: hubmodel.attributes.description,
    owner: { username: hubmodel.attributes.owner },

    // TODO: Temp backwards compatibility
    item: {
      id: hubmodel.id,
      title: hubmodel.attributes.name,
      snippet: "Missing from Hub API v3",
      owner: hubmodel.attributes.owner,
      description: hubmodel.attributes.description,
      tags: hubmodel.attributes.tags,
      created: hubmodel.attributes.created,
      numViews: 0,
      modified: hubmodel.attributes.modified,
      size: hubmodel.attributes.size,
      type: hubmodel.attributes.type
    }
  };

  return content;
}
