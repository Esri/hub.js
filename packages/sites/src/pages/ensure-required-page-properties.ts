import { cloneObject, IModelTemplate } from "@esri/hub-common";
import { getPageItemType } from "./get-page-item-type";
import { PAGE_TYPE_KEYWORD } from "./page-type-keyword";

/**
 * Given a Page Model, ensure that it has all the requires properties set correctly
 * and return a new object
 * @param {Object} pageModel Page Model object
 * @param {Object} options {username, portalVersion, isPortal}
 */
export function ensureRequiredPageProperties(
  pageModel: IModelTemplate,
  options: any
) {
  // clone
  const result = cloneObject(pageModel);
  result.item.owner = options.username;
  result.item.access = "private";
  if (!result.data.values) {
    result.data.values = {};
  }
  result.data.values.updatedAt = new Date().toISOString();
  result.data.values.updatedBy = options.username;

  if (!result.data.values.sites) {
    result.data.values.sites = [];
  }
  // NOTE: until we have hub-home, we are setting the page url to ''
  if (result.item.url) {
    result.item.url = "";
  }

  result.item.type = getPageItemType(options.isPortal);
  // ensure it has the typeKeyword
  if (result.item.typeKeywords.indexOf(PAGE_TYPE_KEYWORD) === -1) {
    result.item.typeKeywords.push(PAGE_TYPE_KEYWORD);
  }
  return result;
}
