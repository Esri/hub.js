import type { IItem } from "@esri/arcgis-rest-portal";

/**
 * Determines if a given Form item is a draft
 * @param {IItem} formItem A Form item
 * @returns {boolean}
 */
export function isDraft(formItem: IItem): boolean {
  return formItem.typeKeywords.indexOf("Draft") > -1;
}
