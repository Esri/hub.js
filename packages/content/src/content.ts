/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { getItemData } from "@esri/arcgis-rest-portal";
import { request } from "@esri/arcgis-rest-request";
import { HubType, IHubContent, includes } from "@esri/hub-common";
import { IGetContentOptions, getContentFromHub } from "./hub";
import {
  getContentFromPortal,
  fetchContentProperties,
  IContentPropertyRequests
} from "./portal";
import { isSlug, parseDatasetId } from "./slugs";

function shouldFetchData(hubType: HubType) {
  // TODO: we probably want to fetch data by default for other types of data
  return includes(['map', 'template'], hubType);
}

/**
 * Fetch content using either the Hub API or the ArcGIS REST API
 * @param identifier Hub API slug ({orgKey}::{title-as-slug} or {title-as-slug})
 * or record id ((itemId}_{layerId} or {itemId})
 * @param options - request options that may include authentication
 */
export function getContent(
  identifier: string,
  options?: IGetContentOptions
): Promise<IHubContent> {
  // first fetch and format the content from the Hub or portal API
  let getContentPromise: Promise<IHubContent>;
  if (options && options.isPortal) {
    const { itemId } = parseDatasetId(identifier);
    getContentPromise = getContentFromPortal(itemId, options);
  } else {
    getContentPromise = getContentFromHub(identifier, options).catch(e => {
      // dataset is not in index (i.e. might be a private item)
      if (!isSlug(identifier)) {
        // try fetching from portal instead
        return getContentFromPortal(identifier, options);
      }
      return Promise.reject(e);
    });
  }
  return getContentPromise.then(content => {
    // fetch additional properties based on content type
    const propertiesToFetch: IContentPropertyRequests = {};
    if (shouldFetchData(content.hubType)) {
      propertiesToFetch.data = getItemData;
    }
    if (Object.keys(propertiesToFetch).length === 0) {
      return content;
    }
    return fetchContentProperties(
      {
        data: getItemData
      },
      content,
      options
    );
  });
}

// TODO: remove this next breaking version
/**
 * @returns not much
 * @restlink https://developers.arcgis.com/rest/
 */
export function comingSoon(): Promise<any> {
  return request("https://www.arcgis.com/sharing/rest/info");
}
