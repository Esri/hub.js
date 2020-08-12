/* Copyright (c) 2020 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { IItem } from "@esri/arcgis-rest-types";

/**
 * Determines if a given Form item is a draft
 * @param {IItem} formItem A Form item
 * @returns {boolean}
 */
export function isDraft(formItem: IItem): boolean {
  return formItem.typeKeywords.indexOf("Draft") > -1;
}
