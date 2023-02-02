import { cloneObject, IModel, mergeObjects } from "../index";
import { IVersion } from "./types";
import { isSiteType } from "../content";
import { isPageType } from "../content/_internal";

// applies the version to the model
export function applyVersion(
  model: IModel,
  version: IVersion,
  includeList: string[]
) {
  return mergeObjects(version.data, cloneObject(model), includeList);
}

export function getIncludeListFromItemType(model: IModel): string[] {
  const defaultIncludeList = [
    "data.values.layout",
    "data.values.theme",
    "data.values.headContent",
  ];
  let includeList;
  if (isSiteType(model.item.type, model.item.typeKeywords)) {
    includeList = defaultIncludeList;
  } else if (isPageType(model.item.type, model.item.typeKeywords)) {
    includeList = ["data.values.layout", "data.values.headContent"];
  } else {
    throw TypeError("item type does not support versioning");
  }

  return includeList;
}
