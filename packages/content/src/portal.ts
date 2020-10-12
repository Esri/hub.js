/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { IItem, getItem, getItemGroups } from "@esri/arcgis-rest-portal";
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
  cloneObject,
  includes,
  failSafe
} from "@esri/hub-common";
import { getContentMetadata } from "./metadata";

function getGroupIds(
  itemId: string,
  requestOptions: IHubRequestOptions
): Promise<string[]> {
  return getItemGroups(itemId, requestOptions).then(response => {
    const { admin, member, other } = response;
    return [...admin, ...member, ...other].map(group => group.id);
  });
}

// simultaneously execute multiple async requests to populate content properties
// returns a hash of all the resolved property values that also has
// an array of property names for which the request failed
// NOTE: assumes each request takes only the item id and request options
function fetchProperties(
  propertyRequests: {
    [key: string]: (
      itemId: string,
      requestOptions: IHubRequestOptions
    ) => Promise<unknown>;
  },
  itemId: string,
  requestOptions: IHubRequestOptions
): Promise<{ [key: string]: unknown }> {
  const propertyNames = Object.keys(propertyRequests);
  // ideally we'd be able to use hashSettled(), but that's not standard
  // so instead return the property name to indicate that the request failed
  const requests = propertyNames.map(propertyName =>
    failSafe(propertyRequests[propertyName], propertyName)(
      itemId,
      requestOptions
    )
  );
  return Promise.all(requests).then(values => {
    return values.reduce(
      (properties, value, i) => {
        const propertyName = propertyNames[i];
        if (value === propertyName) {
          // capture that the request failed
          properties.errors.push(propertyName);
        } else {
          properties[propertyName] = value;
        }
        return properties;
      },
      { errors: [] } as { [key: string]: unknown }
    );
  });
}

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
    categories: parseItemCategories(item.categories),
    itemCategories: item.categories,
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

/**
 * Splits item category strings at slashes and discards the "Categories" keyword
 *
 * ```
 * ["/Categories/Boundaries", "/Categories/Planning and cadastre/Property records", "/Categories/Structure"]
 * ```
 * Should end up being
 * ```
 * ["Boundaries", "Planning and cadastre", "Property records", "Structure"]
 * ```
 *
 * @param categories - an array of strings
 * @private
 */
export function parseItemCategories(categories: string[]) {
  if (!categories) return categories;

  const exclude = ["categories", ""];
  const parsed = categories.map(cat => cat.split("/"));
  const flattened = parsed.reduce((acc, arr, _) => [...acc, ...arr], []);
  return flattened.filter(cat => !includes(exclude, cat.toLowerCase()));
}

/**
 * Fetch content using the ArcGIS REST API
 * @param item id
 * @param options - request options that may include authentication
 */
export function getContentFromPortal(
  itemId: string,
  requestOptions?: IHubRequestOptions
): Promise<IHubContent> {
  return getItem(itemId, requestOptions).then(item => {
    const content = withPortalUrls(itemToContent(item), requestOptions);
    // TODO: provide some API to let consumers opt out of making these additional requests
    return fetchProperties(
      {
        groupIds: getGroupIds,
        metadata: getContentMetadata
      },
      content.id,
      requestOptions
    ).then(properties => {
      return { ...content, ...properties };
    });
  });
}
