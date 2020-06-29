/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { IFormItem } from "@esri/hub-common";
import { isDraft } from "./is-draft";

/**
 * Determines if a given IFormItem has been published
 * @param {IFormItem} formItem A Form item
 * @returns {boolean}
 */
export function isPublished (
  formItem: IFormItem
): boolean {
  return !isDraft(formItem);
};