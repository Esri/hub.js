import { IModel, IHubRequestOptions, getProp } from "@esri/hub-common";
import { getSiteItemType } from "../get-site-item-type";
import { updateSite } from "../update-site";
import { getPageItemType, updatePage } from "../pages";

export function savePublishedStatus(
  siteOrPageModel: IModel,
  hubRequestOptions: IHubRequestOptions
) {
  const allowList = ["item.typeKeywords"]; // only want to save typeKeywords
  let prms;

  switch (getProp(siteOrPageModel, "item.type")) {
    case getSiteItemType(hubRequestOptions.isPortal):
      prms = updateSite(siteOrPageModel, allowList, hubRequestOptions);
      break;
    case getPageItemType(hubRequestOptions.isPortal):
      prms = updatePage(siteOrPageModel, allowList, hubRequestOptions);
      break;
    default:
      throw TypeError(
        "@esri/hub-sites: only page or site models have a published state"
      );
  }

  return prms;
}
