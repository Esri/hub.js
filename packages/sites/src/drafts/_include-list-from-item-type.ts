import { getSiteItemType } from "../get-site-item-type";
import { getPageItemType } from "../pages";
import { SITE_DRAFT_INCLUDE_LIST } from "./site-draft-include-list";
import { PAGE_DRAFT_INCLUDE_LIST } from "./page-draft-include-list";

/**
 * Returns the right include list for the item type.
 * @param siteOrPageModel - the site or page model
 * @param isPortal - if we're on portal or not
 */
export function _includeListFromItemType(itemType: string, isPortal: boolean) {
  let includeList;
  switch (itemType) {
    case getSiteItemType(isPortal):
      includeList = SITE_DRAFT_INCLUDE_LIST;
      break;
    case getPageItemType(isPortal):
      includeList = PAGE_DRAFT_INCLUDE_LIST;
      break;
    default:
      throw TypeError(
        "@esri/hub-sites: drafts only belong to a site or a page item model"
      );
  }
  return includeList;
}
