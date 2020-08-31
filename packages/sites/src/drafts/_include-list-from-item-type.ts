import { SITE_DRAFT_INCLUDE_LIST } from "./site-draft-include-list";
import { PAGE_DRAFT_INCLUDE_LIST } from "./page-draft-include-list";
import { isSite } from "../is-site";
import { isPage } from "../pages";
import { IItem } from "@esri/arcgis-rest-portal";

/**
 * Returns the right include list for the item type.
 * @param siteOrPageModel - the site or page model
 * @private
 */
export function _includeListFromItemType(siteOrPageItem: IItem) {
  let includeList;
  if (isSite(siteOrPageItem)) {
    includeList = SITE_DRAFT_INCLUDE_LIST;
  } else if (isPage(siteOrPageItem)) {
    includeList = PAGE_DRAFT_INCLUDE_LIST;
  } else {
    throw TypeError(
      "@esri/hub-sites: drafts only belong to a site or a page item model"
    );
  }

  return includeList;
}
