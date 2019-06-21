/* Copyright (c) 2019 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { categories } from "./categories";

const cache: { [key: string]: string } = {};

/**
 * ```js
 * import { getCategory } from "@esri/hub-common";
 * //
 * getCategory('Feature Layer')
 * > 'dataset'
 * ```
 * To do.
 * @param itemType The ArcGIS [item type](https://developers.arcgis.com/rest/users-groups-and-items/items-and-item-types.htm).
 * @returns the category of a given item type.
 */
export function getCategory(itemType: string = ""): string {
  if (cache[itemType]) {
    return cache[itemType];
  }
  for (const category of Object.keys(categories)) {
    for (const type of categories[category]) {
      if (itemType.toLowerCase() === type.toLowerCase()) {
        cache[itemType] = category;
        return category;
      }
    }
  }
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
 * import { getType } from "@esri/hub-common";
 * //
 * getType(item)
 * > [ 'Hub Site Application' ]
 * ```
 * To do.
 * @param layer Layer object.
 * @param item Item object.
 * @returns type of the input layer/item.
 *
 */
export function getType(layer: any = {}, item: any = {}): string {
  if (layer.type) {
    return layer.type;
  }
  const typeKeywords = item.typeKeywords || [];
  if (item.type === "Web Mapping Application") {
    if (typeKeywords.includes("hubSite")) {
      return "Hub Site Application";
    } else if (typeKeywords.includes("hubPage")) {
      return "Hub Page";
    }
  }
  return item.type;
}

/**
 * ```js
 * import { getTypeCategories } from "@esri/hub-common";
 * //
 * getTypeCategories(item)
 * > [ 'Hub Site Application' ]
 * ```
 * To do.
 * @param layer Layer object.
 * @param item Item object.
 * @returns type of the input layer/item.
 *
 */
export function getTypeCategories(layer: any = {}, item: any = {}): string[] {
  const type: string = getType(layer, item);
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
