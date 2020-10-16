/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import {
  getItemData,
  getUser,
  IGetUserOptions
} from "@esri/arcgis-rest-portal";
import { request } from "@esri/arcgis-rest-request";
import { HubType, IHubContent, IHubRequestOptions } from "@esri/hub-common";
import { IGetContentOptions, getContentFromHub } from "./hub";
import {
  getContentFromPortal,
  _fetchContentProperties,
  IContentPropertyRequests
} from "./portal";
import { isSlug, parseDatasetId } from "./slugs";

function shouldFetchData(hubType: HubType) {
  // TODO: we probably want to fetch data by default for other types of data
  return hubType === "map";
}

function isHubCreatedContent(content: IHubContent) {
  const hubTypeKeywords = ["Enterprise Sites", "ArcGIS Hub"];
  const contentTypeKeywords = content.typeKeywords || [];
  // currently Hub only creates web maps, so
  // we may want to remove or modify this type check later
  return (
    content.type === "Web Map" &&
    contentTypeKeywords.some(
      typeKeyword => hubTypeKeywords.indexOf(typeKeyword) > -1
    )
  );
}

function shouldFetchOrgId(content: IHubContent) {
  return !content.orgId && isHubCreatedContent(content);
}

function getOwnerOrgId(
  content: IHubContent,
  requestOptions: IHubRequestOptions
): Promise<string> {
  const options: IGetUserOptions = {
    username: content.owner,
    ...requestOptions
  };
  return getUser(options).then(user => user.orgId);
}

function getContentData(
  content: IHubContent,
  requestOptions: IHubRequestOptions
) {
  return getItemData(content.id, requestOptions);
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
    // see if there are additional properties to fetch based on content type
    const propertiesToFetch: IContentPropertyRequests = {};
    if (shouldFetchData(content.hubType)) {
      propertiesToFetch.data = getContentData;
    }
    if (shouldFetchOrgId(content)) {
      propertiesToFetch.orgId = getOwnerOrgId;
    }
    if (Object.keys(propertiesToFetch).length === 0) {
      // nothing more to fetch
      return content;
    }
    return _fetchContentProperties(propertiesToFetch, content, options);
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
