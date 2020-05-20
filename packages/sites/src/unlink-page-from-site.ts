import { IHubRequestOptions } from "@esri/hub-common";

/**
 * Given a Site Id and a Page Id, remove the page from the site
 * @param {Object} options  { siteId, pageId }
 */
export function unlinkPageFromSite(
  pageId: string,
  siteId: string,
  requestOptions: IHubRequestOptions
) {
  throw new Error("Deprecated: use unlinkSiteAndPage");
}
