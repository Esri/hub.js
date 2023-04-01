import { IModel } from "../../types";
import { isSiteType } from "../../content/isSiteType";
import { isPageType } from "../../content/_internal/internalContentUtils";
import { SiteVersionIncludeList } from "../../sites/_internal/SiteBusinessRules";
import { PageVersionIncludeList } from "../../pages/_internal/PageBusinessRules";

/**
 * Gets the include list for the model type
 * @param model
 * @returns
 */
export function getIncludeListFromItemType(model: IModel): string[] {
  let includeList;
  if (isSiteType(model.item.type, model.item.typeKeywords)) {
    includeList = SiteVersionIncludeList;
  } else if (isPageType(model.item.type, model.item.typeKeywords)) {
    includeList = PageVersionIncludeList;
  } else {
    throw TypeError("Entity type does not support versioning");
  }

  return includeList;
}
