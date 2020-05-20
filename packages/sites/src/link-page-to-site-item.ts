import { IModel, IHubRequestOptions } from "@esri/hub-common";

/**
 * Given a Site Item, add a page to it and save it
 * @param {Object} siteModel Site Model
 * @param {Object} options Hash containing the pageId and title
 * @param {Object} requestOptions
 */
export function linkPageToSiteItem(
  siteModel: IModel,
  options: any,
  requestOptions: IHubRequestOptions
) {
  throw new Error("Deprecated: use linkSiteAndPage");
}
