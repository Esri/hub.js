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
import { removeUnusedResources } from "./layout";

/**
 * Update an existing Item
 * In order to reduce collisions with concurrent editing, this
 * function will fetch the current item from ago, and then apply
 * a subset of property changes to the model. The props to update
 * are passed in via allowList. If the list is empty, then
 * the entire site model is sent.
 * @param {Object} model Site Model to update
 * @param {Array} allowList Array of property paths to update
 * @param {IHubRequestOptions} hubRequestOptions
 */
export function updateSite(
  model: IModel,
  allowList: string[],
  hubRequestOptions: IHubRequestOptions
): Promise<IUpdateItemResponse> {
  allowList = allowList || [];

  // apply any on-save site upgrades here...
  deepSet(model, "data.values.uiVersion", SITE_UI_VERSION);
  deepSet(model, "data.values.updatedAt", new Date().toISOString());
  deepSet(
    model,
    "data.values.updatedBy",
    hubRequestOptions.authentication.username
  );

  // we only add these in if an allowList was passed in
  if (allowList.length) {
    allowList.push("data.values.updatedAt");
    allowList.push("data.values.updatedBy");
    allowList.push("data.values.uiVersion");
    // any save needs to be able to update the schema version
    // which will have been bumped if a schema migration
    // occured during the load cycle
    allowList.push("item.properties.schemaVersion");
  }

  // PORTAL-ENV: no domain service so we encode the subdomain in a typeKeyword
  if (hubRequestOptions.isPortal) {
    model.item.typeKeywords = _ensurePortalDomainKeyword(
      getProp(model, "data.values.subdomain"),
      model.item.typeKeywords
    );
    // see above comment why ths is gated...
    if (allowList.length) {
      allowList.push("item.typeKeywords");
    }
  }
  // Actually start the update process...

  let agoModelPromise;
  // if we have a allowList, refetch the site to check for changes...
  if (allowList.length) {
    agoModelPromise = getModel(model.item.id, hubRequestOptions);
  } else {
    // if we dont have a allowList, just resolve with the model we have
    agoModelPromise = Promise.resolve(model);
  }

  // Kick things off...
  return agoModelPromise
    .then(agoModel => {
      // if the model from ago has a newer modified timestamp
      if (agoModel.item.modified > model.item.modified) {
        // merge the props in the allow list into the model from AGO
        model = mergeObjects(model, agoModel, allowList);
      }
      // send the update to ago
      return updateItem({
        item: serializeModel(model),
        authentication: hubRequestOptions.authentication,
        params: { clearEmptyFields: true }
      });
    })
    .then(updateResponse => {
      // clean up un-used crop images. The internals of this are failSafed as it's not critical
      // and we return the udpateResponse object from the previous step
      return removeUnusedResources(
        model.item.id,
        model.data.values.layout,
        hubRequestOptions
      ).then(_ => {
        return updateResponse;
      });
    })
    .catch(err => {
      throw Error(`updateSite: Error updating site: ${err}`);
    });
}
