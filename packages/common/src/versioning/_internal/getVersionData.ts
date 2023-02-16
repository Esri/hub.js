import { IModel } from "../../types";
import { mergeObjects } from "../../objects";

/**
 * Returns the version data (ie the part of the model that gets versioned) from the model
 * @param model
 * @param includeList
 * @private
 */
export function getVersionData(
  model: IModel,
  includeList: string[]
): Record<string, any> {
  return mergeObjects(model, {}, includeList);
}
