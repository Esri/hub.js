/* Copyright (c) 2020 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { IItem } from "@esri/arcgis-rest-types";
import { isDraft } from "./is-draft";

/**
 * Determines if a given Form item has been published
 * @param {IItem} formItem A Form item
 * @returns {boolean}
 */
export function isPublished(formItem: IItem): boolean {
  return !isDraft(formItem);
}
