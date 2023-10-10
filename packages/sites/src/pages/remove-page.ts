import {
  IModel,
  getModel,
  mapBy,
  getWithDefault,
  failSafe,
  unprotectModel,
} from "@esri/hub-common";
import { unlinkSiteAndPage } from "../unlink-site-and-page";
import { removeItem } from "@esri/arcgis-rest-portal";
import { IUserRequestOptions } from "@esri/arcgis-rest-auth";

/**
 * Remove a Page Item. This deletes the item.
 * @param {Object | String} idOrModel Model object or Item Id
 * @param {IRequestOptions} requestOptions
 */
export function removePage(
  idOrModel: string | IModel,
  requestOptions: IUserRequestOptions
) {
  let modelPromise = Promise.resolve(idOrModel);
  if (typeof idOrModel === "string") {
    modelPromise = getModel(idOrModel, requestOptions);
  }
  let pageModel: IModel;
  // fire it to get the model...
  return modelPromise
    .then((model) => {
      pageModel = model as IModel;
      // get the id's of the sites this page is linked to...
      const linkedSites = mapBy(
        "id",
        getWithDefault(pageModel, "data.values.sites", [])
      );
      // we need to unlink the page from all sites. However, these calls *could* fail
      // if the current user lacks rights to save the site item, so we just make sure these
      // always resolve. In the Ember service code, we used `allSettled` but that's RSVP special sauce
      const failSafeUnlink = failSafe(unlinkSiteAndPage);
      return Promise.all(
        linkedSites.map((siteId: string) => {
          const opts = Object.assign(
            {
              pageModel,
              siteId,
            },
            requestOptions
          );
          return failSafeUnlink(opts);
        })
      );
    })
    .then(() => {
      return unprotectModel(pageModel, requestOptions);
    })
    .then(() => {
      const opts = Object.assign({ id: pageModel.item.id }, requestOptions);
      return removeItem(opts);
    });
}
