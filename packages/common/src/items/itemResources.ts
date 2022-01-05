/* Copyright (c) 2018-2021 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { getItemResources } from "@esri/arcgis-rest-portal";
import { IRequestOptions } from "@esri/arcgis-rest-request";

// MOVE TO REST JS
export interface IResource {
  access: string;
  created: number;
  resource: string;
  size: number;
}

/**
 * Return the number of resources attached to an item
 *
 * @export
 * @param {string} id
 * @param {UserSession} session
 * @return {*}  {Promise<number>}
 */
export function getResourceCount(
  id: string,
  requestOptions: IRequestOptions
): Promise<number> {
  // clone the requestoptions, adding in params
  const ro = {
    ...requestOptions,
    ...{ params: { num: 1 } },
  } as IRequestOptions;

  return getItemResources(id, ro).then((result) => {
    return result.total as number;
  });
}

/**
 * Returns all the resources for an item
 *
 * Handle paging internally and returns a flat array of `IResource`s
 *
 * @export
 * @param {string} id
 * @param {UserSession} session
 * @return {*}  {Promise<IResource[]>}
 */
export function getAllResources(
  id: string,
  requestOptions: IRequestOptions
): Promise<IResource[]> {
  const PAGESIZE = 100;
  // get the count of the resources
  return getResourceCount(id, requestOptions).then((count) => {
    const resources = [] as IResource[];
    // if item has resources
    if (count > 0) {
      // make a set of paged requests for the resources
      // this will only be invoked if the item has > 100 resources
      // which while rare, is not impossible
      const pagedPromises = [];
      for (let i = 1; i <= count; i = i + PAGESIZE) {
        pagedPromises.push(getPagedResources(id, i, PAGESIZE, requestOptions));
      }
      // let that run. We don't batch as the item would need
      // to have 1000's of resources before there would be an issue
      return Promise.all(pagedPromises).then((results) => {
        // flatten
        return ([] as IResource[]).concat(...results);
      });
    } else {
      // just return the empty array
      return resources;
    }
  });
}

/**
 * Request resources in paged blocks. This simply returns the resource information
 * it does not return the actual files.
 *
 * @export
 * @param {string} id
 * @param {number} start
 * @param {number} num
 * @param {UserSession} session
 * @return {*}  {Promise<IResource>}
 */
function getPagedResources(
  id: string,
  start: number,
  num: number,
  requestOptions: IRequestOptions
): Promise<IResource> {
  // clone the requestoptions, adding in params
  const ro = {
    ...requestOptions,
    ...{ params: { num, start } },
  } as IRequestOptions;

  // make the request
  return getItemResources(id, ro).then((result) => {
    // return just the resources array
    return result.resources;
  });
}
