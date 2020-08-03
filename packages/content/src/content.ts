/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { ISpatialReference, IExtent } from "@esri/arcgis-rest-types";
import { IItem, getItem, IPortal } from "@esri/arcgis-rest-portal";
import { request } from "@esri/arcgis-rest-request";
import {
  HubType,
  IHubContent,
  IHubGeography,
  IHubRequestOptions,
  IBBox,
  buildUrl,
  getType,
  getCategory,
  getItemThumbnailUrl
} from "@esri/hub-common";
import { parseDatasetId } from "./util";

// TODO: make this real; use request() under the hood?
export function hubRequest(url: string, requestOptions?: IHubRequestOptions) {
  return fetch(url, {
    method: "POST", // TODO: get from requestOptions?
    headers: {
      // TODO: base on request requestOptions?
      "Content-Type": "application/json"
    }
    // TODO: base on requestOptions.params?
    // body: JSON.stringify(body)
  }).then(resp => {
    if (resp.ok) {
      return resp.json();
    } else {
      throw resp.statusText;
    }
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
    const dataset = resp && resp.data && resp.data[0];
    return datasetToContent(dataset, requestOptions.portalSelf);
  });
}

function getContentFromAgo(
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
function getItemHubType(itemOrType: IItem | string): HubType {
  const itemType =
    typeof itemOrType === "string" ? itemOrType : getType(itemOrType);
  // TODO: not all categories are Hub types, may need to validate
  return getCategory(itemType) as HubType;
}

function createExtent(
  xmin: number,
  ymin: number,
  xmax: number,
  ymax: number,
  wkid?: number
): IExtent {
  return {
    xmin,
    ymin,
    xmax,
    ymax,
    // type: 'extent',
    spatialReference: {
      wkid: wkid || 4326
    }
  };
}

function itemExtentToBoundary(extent: IBBox): IHubGeography {
  if (!extent) {
    return;
  }
  return {
    // size?
    // center?
    geometry: createExtent(
      extent[0][0],
      extent[0][1],
      extent[1][0],
      extent[1][1]
    )
  };
}

function itemToContent(item: IItem, portal?: IPortal): IHubContent {
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
      permission: item.itemControl || "view"
    },
    // Hub configuration metadata from item properties
    actionLinks: properties && properties.links,
    hubActions: properties && properties.actions,
    metrics: properties && properties.metrics,
    // default boundary from item.extent
    boundary: itemExtentToBoundary(item.extent),
    license: { name: "Custom License", description: item.accessInformation },
    // dates and sources
    createdDate,
    createdDateSource,
    publishedDate: createdDate,
    publishedDateSource: createdDateSource,
    updatedDate: new Date(item.modified),
    updatedDateSource: "item.modified"
  });
  if (portal) {
    // add properties that depend on portal
    content.thumbnailUrl = getItemThumbnailUrl(item, portal);
  }
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
  // TODO: IDataset
  dataset: any,
  portal?: IPortal
): IHubContent {
  if (!dataset) {
    return;
  }

  // extract item from dataset and create content
  const item = datasetToItem(dataset);
  const content = itemToContent(item, portal);

  // overwrite or add enrichments from Hub API
  const attributes = dataset.attributes;
  if (!attributes) {
    return content;
  }
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

function datasetToItem(dataset: any): IItem {
  const { id, attributes = {} } = dataset;

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
    owner,
    orgId,
    created,
    modified,
    // what is guid? it was returned in
    // https://www.arcgis.com/sharing/rest/content/items/7a153563b0c74f7eb2b3eae8a66f2fbb?f=json
    // but I don't see it here:
    // https://developers.arcgis.com/rest/users-groups-and-items/item.htm
    // guid: null,
    // TODO: The file name of the item for file types. Read-only.
    // name: null,
    title: name,
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
    return getContentFromAgo(id, requestOptions);
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
