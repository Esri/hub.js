import {
  IModel,
  IHubRequestOptions,
  deepSet,
  getProp,
  getModel,
  mergeObjects,
  serializeModel
} from "@esri/hub-common";
import { SITE_UI_VERSION } from "./site-ui-version";
import { _ensurePortalDomainKeyword } from "./_ensure-portal-domain-keyword";
import { updateItem, IUpdateItemResponse } from "@esri/arcgis-rest-portal";

/**
 * Update an existing site item
 * This function supports the equivalent of a PATCH REST operation
 * It will fetch the current item from ago, and then apply
 * a subset of property changes to the model if a patchList is included.
 * The patchList can include any property paths on the item.
 * If the list is empty, then the entire site model is overwritten.
 * @param {Object} model Site Model to update
 * @param {Array} patchList Array of property paths to update
 * @param {IHubRequestOptions} hubRequestOptions
 * @param {boolean} [updateVersions=true] Optionally update the versions, defaults to true
 */
export function updateSite(
  model: IModel,
  patchList: string[],
  hubRequestOptions: IHubRequestOptions,
  updateVersions: boolean = true
): Promise<IUpdateItemResponse> {
  patchList = patchList || [];

  // apply any on-save site upgrades here...
  deepSet(model, "data.values.uiVersion", SITE_UI_VERSION);
  deepSet(model, "data.values.updatedAt", new Date().toISOString());
  deepSet(
    model,
    "data.values.updatedBy",
    hubRequestOptions.authentication.username
  );

  // we only add these in if an patchList was passed in
  if (patchList.length) {
    patchList.push("data.values.updatedAt");
    patchList.push("data.values.updatedBy");
    if (updateVersions) {
      patchList.push("data.values.uiVersion");
      // any save needs to be able to update the schema version
      // which will have been bumped if a schema migration
      // occured during the load cycle
      patchList.push("item.properties.schemaVersion");
    }
  }

  // PORTAL-ENV: no domain service so we encode the subdomain in a typeKeyword
  if (hubRequestOptions.isPortal) {
    model.item.typeKeywords = _ensurePortalDomainKeyword(
      getProp(model, "data.values.subdomain"),
      model.item.typeKeywords
    );
    // see above comment why ths is gated...
    if (patchList.length) {
      patchList.push("item.typeKeywords");
    }
  }
  // Actually start the update process...

  let agoModelPromise;
  // if we have a patchList, refetch the site to check for changes...
  if (patchList.length) {
    agoModelPromise = getModel(model.item.id, hubRequestOptions);
  } else {
    // if we dont have a patchList, just resolve with the model we have
    agoModelPromise = Promise.resolve(model);
  }

  // Kick things off...
  return agoModelPromise
    .then(agoModel => {
      if (patchList.length) {
        // merge the props in the allow list into the model from AGO
        model = mergeObjects(model, agoModel, patchList);
      }
      // send the update to ago
      return updateItem({
        item: serializeModel(model),
        authentication: hubRequestOptions.authentication,
        params: { clearEmptyFields: true }
      });
    })
    .catch(err => {
      throw Error(`updateSite: Error updating site: ${err}`);
    });
}
