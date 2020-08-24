import { mergeObjects, IModel } from "@esri/hub-common";

/**
 * Builds a draft with a subset of the model properties
 * @param {*} model - item model
 * @param {*} includeList - list of property paths to include in draft object
 */
export function buildDraft(model: IModel, includeList: string[]) {
  return mergeObjects(model, {}, includeList);
}
