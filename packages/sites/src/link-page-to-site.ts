import { IHubRequestOptions } from "@esri/hub-common";

/**
 * Given a Page item, title and slug, link it to a site item
 * @param {Object} options  {siteId, pageId, pageTitle, }
 */
export function linkPageToSite(
  options: any,
  requestOptions: IHubRequestOptions
) {
  throw new Error("Deprecated: use linkSiteAndPage");
}
