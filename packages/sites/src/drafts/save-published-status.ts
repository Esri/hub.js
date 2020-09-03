import { IModel, IHubRequestOptions } from "@esri/hub-common";
import { updateSite } from "../update-site";
import { updatePage, isPage } from "../pages";
import { isSite } from "../is-site";
import { IUpdateItemResponse } from "@esri/arcgis-rest-portal";

/**
 * Saves the published status of a site or page model
 * leaving everything else on the model alone.
 *
 * @param siteOrPageModel
 * @param hubRequestOptions
 */
export function savePublishedStatus(
  siteOrPageModel: IModel,
  hubRequestOptions: IHubRequestOptions
): Promise<IUpdateItemResponse> {
  const allowList = ["item.typeKeywords"]; // only want to save typeKeywords
  const { item } = siteOrPageModel;
  let prms;

  if (isSite(item)) {
    prms = updateSite(siteOrPageModel, allowList, hubRequestOptions);
  } else if (isPage(item)) {
    prms = updatePage(siteOrPageModel, allowList, hubRequestOptions);
  } else {
    throw TypeError(
      "@esri/hub-sites: only page or site models have a published state"
    );
  }

  return prms;
}
