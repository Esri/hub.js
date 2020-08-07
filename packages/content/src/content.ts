/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { ResourceObject } from "jsonapi-typescript";
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
  getItemThumbnailUrl,
  hubRequest
} from "@esri/hub-common";
import { parseDatasetId } from "./util";

export type DatasetResource = ResourceObject<
  "dataset",
  {
    // TODO: actually define the attributes?
    // what is the syntax? adding the following causes errors
    // owner: string;
    [k: string]: any;
  }
>;

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
    // NOTE: this will overwrite any existing item.name, which is
    // The file name of the item for file types. Read-only.
    // presumably there to use as the default file name when downloading
    // we don't store item.name in the Hub API and we use name for title
    name: item.title,
    hubId: item.id,
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
  if (portal) {
    // add properties that depend on portal
    // TODO: the URL to the item's page in the portal's home app
    // content.itemHomeUrl = getItemHomeUrl(content.id, portalUrl);
    // TODO: the URL of the item's data API end point
    // content.itemDataUrl = getItemDataUrl(content, portalUrl, token);
    // the full URL of the thumbnail
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
  dataset: DatasetResource,
  portal?: IPortal
): IHubContent {
  // extract item from dataset and create content
  const item = datasetToItem(dataset);
  const content = itemToContent(item, portal);

  // overwrite hubId
  content.hubId = dataset.id;
  // overwrite or add enrichments from Hub API
  const attributes = dataset.attributes;
  const {
    // common enrichments
    boundary,
    modifiedProvenance,
    slug,
    searchDescription
    // dataset enrichments
    // recordCount
    // TODO: fields, geometryType, layer?, server?, as needed
  } = attributes;
  content.boundary = boundary;
  content.updatedDateSource = modifiedProvenance;
  content.slug = slug;
  // TODO: if (searchDescription) {
  // overwrite default summary (from snippet) w/ search description
  content.summary = searchDescription;
  // }
  // type-specific enrichments
  // TODO: should this be based on existence of attributes instead of hubType?
  // TODO: if the latter, should we return a different subtype of IHubContent for this?
  // if (content.hubType === "dataset") {
  //   content.recordCount = recordCount;
  //   // TODO: fields, geometryType, etc
  // }
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
  // NOTE: we attempt to read all item properties
  // even though some may not be currently returned
  const {
    // start w/ item properties from
    // https://developers.arcgis.com/rest/users-groups-and-items/item.htm
    owner,
    orgId,
    created,
    modified,
    // NOTE: we use attributes.name to store the title or the service/layer name
    // but in Portal name is only used for file types to store the file name (read only)
    name,
    title,
    type,
    typeKeywords,
    description,
    snippet,
    tags,
    thumbnail,
    extent,
    categories,
    // the Hub API doesn't currently return spatialReference
    spatialReference,
    // the Hub API doesn't currently return accessInformation
    accessInformation,
    licenseInfo,
    culture,
    url,
    access,
    // the Hub API doesn't currently return proxyFilter
    proxyFilter,
    properties,
    // the Hub API doesn't currently return appCategories, industries,
    // languages, largeThumbnail, banner, screenshots, listed, ownerFolder
    appCategories,
    industries,
    languages,
    largeThumbnail,
    banner,
    screenshots,
    listed,
    ownerFolder,
    size,
    // the Hub API doesn't currently return protected
    protected: isProtected,
    commentsEnabled,
    // the Hub API doesn't currently return numComments, numRatings,
    // avgRating, numViews, itemControl, scoreCompleteness
    numComments,
    numRatings,
    avgRating,
    numViews,
    itemControl,
    scoreCompleteness,
    // additional attributes we'll need as fallbacks
    createdAt,
    updatedAt,
    serviceSpatialReference
  } = attributes;

  // build and return an item from properties
  // NOTE: we currently do NOT provide default values
  // (i.e. null for scalar attributes, [] for arrays, etc)
  // for attributes that are not returned by the Hub API
  // this helps distinguish an item that comes from the API
  // but forces all consumers to do handle missing properties
  return {
    id: itemId,
    owner: owner as string,
    orgId,
    created: (created || createdAt) as number,
    modified: (modified || updatedAt) as number,
    title: (title || name) as string,
    type,
    typeKeywords,
    description,
    tags,
    snippet,
    thumbnail,
    // we store item.extent in attributes.extent.coordinates
    extent: extent.coordinates,
    categories,
    spatialReference: spatialReference || serviceSpatialReference,
    accessInformation,
    licenseInfo,
    culture,
    url,
    access,
    size,
    protected: isProtected,
    proxyFilter,
    properties,
    appCategories,
    industries,
    languages,
    largeThumbnail,
    banner,
    screenshots,
    listed,
    ownerFolder,
    commentsEnabled,
    numComments,
    numRatings,
    avgRating,
    numViews,
    itemControl,
    scoreCompleteness
  };
}

/**
 * Fetch content using either the Hub API or the ArcGIS REST API
 * @param id - content (item) id
 * @param requestOptions - request options that may include authentication
 */
export function getContent(
  // TODO: this should take a slug as well
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
