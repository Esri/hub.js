import {
  IModel,
  IHubRequestOptions,
  mapBy,
  getWithDefault,
  failSafe
} from "@esri/hub-common";
import { unlinkSiteAndPage } from "./unlink-site-and-page";

/**
 * Given a site, update all the linked page items and remove their
 * references to the site
 * @param {Object} siteModel Site Model
 * @param {IRequestOptions} requestOptions
 */
export function unlinkPagesFromSite(
  siteModel: IModel,
  requestOptions: IHubRequestOptions
) {
  const linkedPages = mapBy(
    "id",
    getWithDefault(siteModel, "data.values.pages", [])
  );
  // we need to unlink the site from all it's pages. However, these calls *could* fail
  // if the current user lacks rights to save the site/page item, so we just make sure these
  // always resolve. In the Ember service code, we used `allSettled` but that's RSVP special sauce
  const failSafeUnlink = failSafe(unlinkSiteAndPage);
  return Promise.all(
    linkedPages.map((pageId: string) => {
      const opts = Object.assign(
        {
          siteModel,
          pageId
        },
        requestOptions
      );
      return failSafeUnlink(opts);
    })
  );
}
