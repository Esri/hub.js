/* Copyright (c) 2020 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { IFormItem } from "@esri/hub-common";

/**
 * Determines if a given IFormItem is a draft
 * @param {IFormItem} formItem A Form item 
 * @returns {boolean}
 */
export const isDraft = function isDraft (
  formItem: IFormItem
): boolean {
  return formItem.typeKeywords.indexOf("Draft") > -1;
};
