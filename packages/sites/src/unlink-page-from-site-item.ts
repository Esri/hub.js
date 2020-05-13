import { IModel, IHubRequestOptions } from "@esri/hub-common";

/**
 * Given a Site Model, unlink a page and update the site item
 * @param {Object} siteModel Site Model
 * @param {string} pageId Id of the page to remove
 * @param {Object} requestOptions Request Options
 */
export function unlinkPageFromSiteItem(
  pageId: string,
  siteModel: IModel,
  requestOptions: IHubRequestOptions
) {
  throw new Error("Deprecated: use unlinkSiteAndPage");
}
