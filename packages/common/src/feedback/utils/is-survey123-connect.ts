import { IItem } from "@esri/arcgis-rest-types";

/**
 * Returns true if the given Form item is a Survey123 Connect
 * survey
 * @param {IItem} formItem The Form item
 * @returns {boolean}
 */
export const isSurvey123Connect = (formItem: IItem) => {
  const results = false;
  if (formItem) {
    const typeKeywords = formItem.typeKeywords ?? [];
    return typeKeywords.includes("Survey123 Connect");
  }
  return results;
};
