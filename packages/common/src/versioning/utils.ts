import { cloneObject, IModel, mergeObjects } from "../index";
import { IVersion } from "./types";
import { isSiteType } from "../content";
import { isPageType } from "../content/_internal";
import { SiteVersionIncludeList } from "../sites/_internal/SiteBusinessRules";
import { PageVersionIncludeList } from "../pages/_internal/PageBusinessRules";

// applies the version to the model
export function applyVersion(
  model: IModel,
  version: IVersion,
  includeList: string[]
): Record<string, any> {
  return mergeObjects(version.data, cloneObject(model), includeList);
}

export function getIncludeListFromItemType(model: IModel): string[] {
  let includeList;
  if (isSiteType(model.item.type, model.item.typeKeywords)) {
    includeList = SiteVersionIncludeList;
  } else if (isPageType(model.item.type, model.item.typeKeywords)) {
    includeList = PageVersionIncludeList;
  } else {
    throw TypeError("item type does not support versioning");
  }

  return includeList;
}
