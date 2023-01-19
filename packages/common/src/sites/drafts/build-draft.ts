import { mergeObjects } from "../../objects";
import { IDraft, IModel } from "../../types";

/**
 * Builds a draft with a subset of the model properties
 * @param {*} model - item model
 * @param {*} includeList - list of property paths to include in draft object
 */
export function buildDraft(model: IModel, includeList: string[]): IDraft {
  return mergeObjects(model, {}, includeList);
}
