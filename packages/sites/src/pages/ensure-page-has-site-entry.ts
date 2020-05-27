import { IModel, getProp } from "@esri/hub-common";

/**
 * To account for complexities in the Solution generation process
 * we need to ensure that the site is linked to the Page before
 * we throw this all through the unlink/delete process
 * @param {Object} siteModel Site Model
 * @param {Objet} pageModel Page Model
 */
export function ensurePageHasSiteEntry(siteModel: IModel, pageModel: IModel) {
  const siteId = siteModel.item.id;
  const parentInitiativeId = getProp(
    siteModel,
    "item.properties.parentInitiativeId"
  );
  // swap initiativeId to siteId
  // for a period of time, this happened during Solution generation
  if (parentInitiativeId) {
    const currentSites = getProp(pageModel, "data.values.sites");
    const initiativeEntry = currentSites.find((e: any) => {
      return e.id === parentInitiativeId;
    });
    if (initiativeEntry) {
      initiativeEntry.id = siteId;
    }
  }
  // ensure that we have an entry for the site
  // during solution generation, we can't inject the
  // site id into the page because the page is created
  // before the site item. We need this present so that
  // the unlinkSiteFromPage functions will be able to update
  // the upstream site
  const sites = getProp(pageModel, "data.values.sites");
  const siteEntry = sites.find((e: any) => {
    return e.id === siteId;
  });
  if (!siteEntry) {
    pageModel.data.values.sites.push({
      id: siteId,
      title: "Current Site to ensure clean removal"
    });
  }
  return pageModel;
}
