import { getWithDefault, IModel } from "@esri/hub-common";

/**
 * Remove a Site from the Page's list of sites it is connected to
 * @param {String} siteId Id of the site to unlink from the page
 * @param {Object} pageModel Page Model
 */
export function removeSiteFromPage(siteId: string, pageModel: IModel) {
  // look for the site in the page hash...
  return getWithDefault(pageModel, "data.values.sites", []).filter((e: any) => {
    return e.id !== siteId;
  });
}
