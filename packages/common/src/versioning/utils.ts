import { cloneObject } from "../util";
import { mergeObjects } from "../objects/merge-objects";
import { IModel } from "../types";
import { IVersion } from "./types/IVersion";
import { getIncludeListFromItemType } from "./_internal/getIncludeListFromItemType";

/**
 * Applies the versioned data to the model
 * @param model
 * @param version
 * @param includeList
 * @returns
 */
export function applyVersion(
  model: IModel,
  version: IVersion,
  includeList?: string[]
): IModel {
  if (!includeList) {
    includeList = getIncludeListFromItemType(model);
  }
  return mergeObjects(version.data, cloneObject(model), includeList);
}
