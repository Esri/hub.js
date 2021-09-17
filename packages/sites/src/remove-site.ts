import {
  IModel,
  IHubUserRequestOptions,
  getModel,
  _unprotectAndRemoveItem,
  failSafe,
} from "@esri/hub-common";
import { unlinkPagesFromSite } from "./unlink-pages-from-site";
import { _removeSiteGroups } from "./_remove-site-groups";
import { _removeParentInitiative } from "./_remove-parent-initiative";
import { _removeSiteDomains } from "./_remove-site-domains";
import { _removeSiteFromIndex } from "./_remove-site-from-index";

/**
 * Remove a Site Item
 * * Unlinks all pages
 * * removes all groups
 * * deletes any parent initiatve
 * * removes site from hub index,
 * * removes all domains associated with the site
 * * removes the site item
 *
 * @param {string || Object} idOrModel Id of the site or a site model
 * @param {IHubUserRequestOptions} hubRequestOptions
 */
export function removeSite(
  idOrModel: string | IModel,
  hubRequestOptions: IHubUserRequestOptions
) {
  let modelPromise: Promise<IModel>;
  if (typeof idOrModel === "string") {
    modelPromise = getModel(idOrModel, hubRequestOptions);
  } else {
    modelPromise = Promise.resolve(idOrModel);
  }
  let siteModel: IModel;
  return modelPromise
    .then((model) => {
      siteModel = model;
      return unlinkPagesFromSite(siteModel, hubRequestOptions);
    })
    .then(() => {
      const opts = Object.assign(
        { id: siteModel.item.id, owner: siteModel.item.owner },
        hubRequestOptions
      );
      return _unprotectAndRemoveItem(opts);
    })
    .then(() => {
      // remove the groups
      return _removeSiteGroups(siteModel, hubRequestOptions);
    })
    .then(() => {
      // remove the parent initiative if that's a thing
      return _removeParentInitiative(siteModel, hubRequestOptions);
    })
    .then(() => {
      // remove the domains associated with the site item
      return _removeSiteDomains(siteModel.item.id, hubRequestOptions);
    })
    .then(() => {
      // remove the site from the Hub index
      // failSafe because this is not critical
      return failSafe(_removeSiteFromIndex, { success: true })(
        siteModel,
        hubRequestOptions
      );
    })
    .catch((err) => {
      throw Error(`removeSite: Error removing site: ${err}`);
    });
}
