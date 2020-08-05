/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { ResourceObject } from 'jsonapi-typescript';
import { ISpatialReference } from "@esri/arcgis-rest-types";
import { IItem, getItem, IPortal } from "@esri/arcgis-rest-portal";
import { request } from "@esri/arcgis-rest-request";
import {
  HubType,
  IHubContent,
  IHubGeography,
  IHubRequestOptions,
  IBBox,
  buildUrl,
  createExtent,
  getType,
  getCategory,
  getItemThumbnailUrl
} from "@esri/hub-common";
import { parseDatasetId } from "./util";

export type DatasetResource = ResourceObject<'dataset', {
  // TODO: actually define the attributes?
  // what is the syntax? adding the following causes errors
  // owner: string;
  [k: string]: any;
}>

// TODO: make this real; use request() under the hood?
export function hubRequest(url: string, requestOptions?: IHubRequestOptions) {
  // requestOptions.params.f = null;
  // return request(url, requestOptions);
  // TODO: cast to JSONAPI document?
  // .then(response => {
  //   const { data, meta } = response;
  //   return { data, meta } as Document;
  // });
  // TODO: base on requestOptions
  const fetchFn = /* requestOptions.fetch || */ fetch;
  return fetchFn(url, {
    method: "POST", // TODO: get from requestOptions?
    headers: {
      // TODO: base on request requestOptions?
      "Content-Type": "application/json"
    }
    // TODO: base on requestOptions.params?
    // body: JSON.stringify(body)
  }).then(resp => {
    // if (resp.ok) {
      return resp.json();
    // } else {
    //   throw new Error(resp.statusText);
    // }
  });
}

function getContentFromHub(
  id: string,
  requestOptions?: IHubRequestOptions
): Promise<IHubContent> {
  const host = requestOptions && requestOptions.hubApiUrl;
  // TODO: what if no host? reject?
  const url = buildUrl({
    host,
    path: `/datasets/${id}`
  });
  return hubRequest(url, requestOptions).then(resp => {
    const dataset = resp && resp.data;
    return dataset && datasetToContent(dataset, requestOptions.portalSelf);
  });
}

function getContentFromPortal(
  id: string,
  requestOptions?: IHubRequestOptions
): Promise<IHubContent> {
  const { itemId } = parseDatasetId(id);
  return getItem(itemId, requestOptions).then(item => {
    const content = itemToContent(item, requestOptions.portalSelf);
    // TODO: fetch remaining content properties (i.e. recordCount, etc) based on hubType. Examples:
    // - if hubType is 'dataset', then fetch recordCount
    // - if hubType is 'document', do nothing?
    return content;
  });
}

/**
 * get the HubType for a given item or item type
 *
 * @param itemOrType an item or item.type
 */
export function getItemHubType(itemOrType: IItem | string): HubType {
  const itemType =
    typeof itemOrType === "string" ? itemOrType : getType(itemOrType);
  // TODO: not all categories are Hub types, may need to validate
  return getCategory(itemType) as HubType;
}

export function itemExtentToBoundary(extent: IBBox): IHubGeography {
  return {
    // TODO: center?
    geometry: createExtent(
      extent[0][0],
      extent[0][1],
      extent[1][0],
      extent[1][1]
    )
  };
}

export function itemToContent(item: IItem, portal?: IPortal): IHubContent {
  const createdDate = new Date(item.created);
  const createdDateSource = "item.created";
  const properties = item.properties;
  const content = Object.assign({}, item, {
    name: item.title || item.name, // should the latter only be for file types?
    hubType: getItemHubType(item),
    // can we strip HTML from description, and do we need to trim it to a X chars?
    summary: item.snippet || item.description,
    publisher: {
      name: item.owner,
      username: item.owner
    },
    permissions: {
      visibility: item.access,
      control: item.itemControl || "view"
    },
    // Hub configuration metadata from item properties
    actionLinks: properties && properties.links,
    hubActions: properties && properties.actions,
    metrics: properties && properties.metrics,
    // default boundary from item.extent
    boundary: item.extent && itemExtentToBoundary(item.extent),
    license: { name: "Custom License", description: item.accessInformation },
    // dates and sources
    createdDate,
    createdDateSource,
    publishedDate: createdDate,
    publishedDateSource: createdDateSource,
    updatedDate: new Date(item.modified),
    updatedDateSource: "item.modified"
  });
  // add properties that depend on portal
  content.thumbnailUrl = portal && getItemThumbnailUrl(item, portal);
  return content;
}

/**
 * Convert a Hub v3 Dataset to Hub Content
 * TODO: Change to use mdJSON translation for configurable metadata
 *
 * @param {IModel} item Hub Item
 * @returns {IHubContent} Hub content object
 * @export
 */
function datasetToContent(
  dataset: DatasetResource,
  portal?: IPortal
): IHubContent {
  // extract item from dataset and create content
  const item = datasetToItem(dataset);
  const content = itemToContent(item, portal);

  // overwrite or add enrichments from Hub API
  const attributes = dataset.attributes;
  const {
    // common enrichments
    boundary,
    modifiedProvenance,
    // dataset enrichments
    recordCount
    // TODO: server, etc
  } = attributes;
  content.boundary = boundary && boundary;
  content.updatedDateSource = modifiedProvenance && modifiedProvenance;
  // type-specific enrichments
  // TODO: should we return a different subtype of IHubContent for this?
  // TODO: should this be based on existence of attributes instead of hubType?
  if (content.hubType === "dataset") {
    content.recordCount = recordCount;
  }
  // TODO: any remaining enrichments
  return content;
}

export function datasetToItem(dataset: DatasetResource): IItem {
  if (!dataset) {
    return;
  }
  const { id, attributes } = dataset;
  if (!attributes) {
    return;
  }

  // parse item id
  const { itemId } = parseDatasetId(id);

  // read item properties from attributes
  const {
    owner,
    orgId,
    created,
    modified,
    name,
    type,
    typeKeywords,
    description,
    tags,
    snippet,
    searchDescription,
    thumbnail,
    extent: { coordinates },
    categories,
    server,
    licenseInfo,
    culture,
    url,
    access,
    size,
    commentsEnabled
  } = attributes;

  // get spatialReference from server properties
  const spatialReference: ISpatialReference = server && server.spatialReference;

  // build and return an item from properties
  return {
    id: itemId,
    owner: owner as string,
    orgId,
    created: created as number,
    modified: modified as number,
    // what is guid? it was returned in
    // https://www.arcgis.com/sharing/rest/content/items/7a153563b0c74f7eb2b3eae8a66f2fbb?f=json
    // but I don't see it here:
    // https://developers.arcgis.com/rest/users-groups-and-items/item.htm
    // guid: null,
    // TODO: The file name of the item for file types. Read-only.
    // name: null,
    title: name as string,
    type,
    typeKeywords,
    description,
    tags,
    // TODO: snippet || searchDescription?
    snippet: searchDescription || snippet,
    thumbnail,
    // the Hub API doesn't return documentation
    // documentation: null,
    extent: coordinates,
    categories,
    spatialReference,
    // the Hub API doesn't return accessInformation
    // accessInformation: null,
    licenseInfo,
    culture,
    // the Hub API doesn't return properties
    // properties: null,
    url,
    // the Hub API doesn't return proxyFilter
    // proxyFilter: null,
    access,
    size,
    // the Hub API doesn't return appCategories, industries, languages,
    // largeThumbnail, banner, screenshots, or listed
    // appCategories: [],
    // industries: [],
    // languages: [],
    // largeThumbnail: null,
    // banner: null,
    // screenshots: [],
    // listed: false,
    commentsEnabled,
    // the Hub API doesn't return any of these remaining props
    // numComments: 0,
    // numRatings: 0,
    // avgRating: 0,
    // we need this one though or TS will complain
    numViews: 0
    // scoreCompleteness: 0,
    // groupDesignations: null
  };
}

/**
 * Fetch content using either the Hub API or the ArcGIS REST API
 * @param id - content (item) id
 * @param requestOptions - request options that may include authentication
 */
export function getContent(
  id: string,
  requestOptions?: IHubRequestOptions
): Promise<IHubContent> {
  if (requestOptions && requestOptions.isPortal) {
    return getContentFromPortal(id, requestOptions);
  } else {
    return getContentFromHub(id, requestOptions);
  }
}

// TODO: remove this next breaking version
/**
 * @returns not much
 * @restlink https://developers.arcgis.com/rest/
 */
export function comingSoon(): Promise<any> {
  return request("https://www.arcgis.com/sharing/rest/info");
}
