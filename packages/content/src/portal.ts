/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { IItem, getItem } from "@esri/arcgis-rest-portal";
import {
  HubType,
  IHubContent,
  IHubGeography,
  IHubRequestOptions,
  IBBox,
  createExtent,
  normalizeItemType,
  getCollection,
  getItemHomeUrl,
  getItemApiUrl,
  getItemDataUrl,
  getItemThumbnailUrl,
  cloneObject
} from "@esri/hub-common";
import { parseDatasetId } from "./hub";

function itemExtentToBoundary(extent: IBBox): IHubGeography {
  return (
    extent &&
    extent.length && {
      // TODO: center?
      geometry: createExtent(
        extent[0][0],
        extent[0][1],
        extent[1][0],
        extent[1][1]
      )
    }
  );
}

/**
 * Return a new content with portal URL (home, API, and data) properties
 *
 * @param content Hub content
 * @param requestOptions Request options
 * @returns Hub content
 * @export
 */
export function withPortalUrls(
  content: IHubContent,
  requestOptions: IHubRequestOptions
) {
  const newContent = cloneObject(content);
  const authentication = requestOptions.authentication;
  const token = authentication && authentication.token;
  // add properties that depend on portal
  newContent.portalHomeUrl = getItemHomeUrl(newContent.id, requestOptions);
  // the URL of the item's Portal API end point
  newContent.portalApiUrl = getItemApiUrl(newContent, requestOptions, token);
  // the URL of the item's data API end point
  newContent.portalDataUrl = getItemDataUrl(newContent, requestOptions, token);
  // the full URL of the thumbnail
  newContent.thumbnailUrl = getItemThumbnailUrl(newContent, requestOptions);
  return newContent;
}

/**
 * Convert a Portal item to Hub content
 *
 * @param item Portal Item
 * @returns Hub content
 * @export
 */
export function itemToContent(item: IItem): IHubContent {
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
    normalizedType: normalizeItemType(item),
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
  return content;
}

/**
 * get the HubType for a given item or item type
 *
 * @param itemOrType an item or item.type
 */
export function getItemHubType(itemOrType: IItem | string): HubType {
  if (typeof itemOrType === "string") {
    itemOrType = { type: itemOrType } as IItem;
  }
  const itemType = normalizeItemType(itemOrType);
  // TODO: not all categories are Hub types, may need to validate
  return getCollection(itemType) as HubType;
}

export function getContentFromPortal(
  id: string,
  requestOptions?: IHubRequestOptions
): Promise<IHubContent> {
  const { itemId } = parseDatasetId(id);
  return getItem(itemId, requestOptions).then(item => {
    const content = withPortalUrls(itemToContent(item), requestOptions);
    // TODO: fetch remaining content properties (i.e. recordCount, etc) based on hubType. Examples:
    // - if hubType is 'dataset', then fetch recordCount
    // - if hubType is 'document', do nothing?
    return content;
  });
}
