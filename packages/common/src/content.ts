/* Copyright (c) 2019 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */
import { IItem } from "@esri/arcgis-rest-portal";
import { collections } from "./collections";
import { categories } from "./categories";
import { includes } from "./utils";

const cache: { [key: string]: string } = {};

// TODO: remove this at next breaking version
/**
 * ```js
 * import { getCategory } from "@esri/hub-common";
 * //
 * getCategory('Feature Layer')
 * > 'dataset'
 * ```
 * **DEPRECATED: Use getCollection() instead**
 * returns the Hub category for a given item type
 * @param itemType The ArcGIS [item type](https://developers.arcgis.com/rest/users-groups-and-items/items-and-item-types.htm).
 * @returns the category of a given item type.
 */
export function getCategory(itemType: string = ""): string {
  /* tslint:disable no-console */
  console.warn(
    "DEPRECATED: Use getCollection() instead. getCategory will be removed at v9.0.0"
  );
  /* tslint:enable no-console */
  const collection = getCollection(itemType);
  // for backwards compatibility
  return collection === "feedback" ? "app" : collection;
}

/**
 * ```js
 * import { getTypes } from "@esri/hub-common";
 * //
 * getTypes('site')
 * > [ 'hub site application' ]
 * ```
 * To do.
 * @param category The ArcGIS Hub category.
 * @returns all the item types for the given category.
 *
 */
export function getTypes(category: string = ""): string[] {
  return categories[category.toLowerCase()];
}

/**
 * ```js
 * import { normalizeItemType } from "@esri/hub-common";
 * //
 * normalizeItemType(item)
 * > [ 'Hub Site Application' ]
 * ```
 * @param item Item object.
 * @returns type of the input item.
 *
 */
export function normalizeItemType(item: any = {}): string {
  let ret = item.type;
  const typeKeywords = item.typeKeywords || [];
  if (
    item.type === "Site Application" ||
    (item.type === "Web Mapping Application" &&
      includes(typeKeywords, "hubSite"))
  ) {
    ret = "Hub Site Application";
  }
  if (
    item.type === "Site Page" ||
    (item.type === "Web Mapping Application" &&
      includes(typeKeywords, "hubPage"))
  ) {
    ret = "Hub Page";
  }
  if (
    item.type === "Hub Initiative" &&
    includes(typeKeywords, "hubInitiativeTemplate")
  ) {
    ret = "Hub Initiative Template";
  }
  if (
    item.type === "Web Mapping Application" &&
    includes(typeKeywords, "hubSolutionTemplate")
  ) {
    ret = "Solution";
  }
  return ret;
}

/**
 * ```js
 * import { getTypeCategories } from "@esri/hub-common";
 * //
 * getTypeCategories(item)
 * > [ 'Hub Site Application' ]
 * ```
 * @param item Item object.
 * @returns typeCategory of the input item.
 *
 */
export function getTypeCategories(item: any = {}): string[] {
  const type: string = normalizeItemType(item);
  const category: string = getCategory(type);
  if (category) {
    // upper case first letter and return as element in array for backwards compatibility
    const chars = Array.from(category);
    chars[0] = chars[0].toUpperCase();
    return [chars.join("")];
  } else {
    return ["Other"];
  }
}

/**
 * ```js
 * import { getCollection } from "@esri/hub-common";
 * //
 * getCollection('Feature Layer')
 * > 'dataset'
 * ```
 * Get the Hub collection for a given item type
 * @param itemType The ArcGIS [item type](https://developers.arcgis.com/rest/users-groups-and-items/items-and-item-types.htm).
 * @returns the Hub collection of a given item type.
 */
export function getCollection(itemType: string = ""): string {
  if (cache[itemType]) {
    return cache[itemType];
  }
  for (const collection of Object.keys(collections)) {
    for (const type of collections[collection]) {
      if (itemType.toLowerCase() === type.toLowerCase()) {
        cache[itemType] = collection;
        return collection;
      }
    }
  }
}

/**
 * Case-insensitive check if the type is "Feature Service"
 * @param {string} type - item's type
 * @returns {boolean}
 */
export const isFeatureService = (type: string) => {
  return type && type.toLowerCase() === "feature service";
};

/**
 * parse layer id from a service URL
 * @param {string} url
 * @returns {string} layer id
 */
export const getLayerIdFromUrl = (url: string) => {
  const endsWithNumberSegmentRegEx = /\/\d+$/;
  const matched = url && url.match(endsWithNumberSegmentRegEx);
  return matched && matched[0].slice(1);
};

/**
 * return the layerId if we can tell that item is a single layer service
 * @param {*} item from AGO
 * @returns {string} layer id
 */
export const getItemLayerId = (item: IItem) => {
  // try to parse it from the URL, but failing that we check for
  // the Singlelayer typeKeyword, which I think is set when you create the item in AGO
  // but have not verified that, nor that we should alway return '0' in that case
  return (
    getLayerIdFromUrl(item.url) ||
    (isFeatureService(item.type) &&
      includes(item.typeKeywords, "Singlelayer") &&
      "0")
  );
};

/**
 * given an item, get the id to use w/ the Hub API
 * @param item
 * @returns Hub API id (hubId)
 */
export const getItemHubId = (item: IItem) => {
  if (item.access !== "public") {
    // the hub only indexes public items
    return;
  }
  const id = item.id;
  const layerId = getItemLayerId(item);
  return layerId ? `${id}_${layerId}` : id;
};
