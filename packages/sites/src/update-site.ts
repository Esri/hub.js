import {
  IModel,
  IUpdateSiteOptions,
  deepSet,
  getProp,
  mergeObjects,
  serializeModel
} from "@esri/hub-common";
import { SITE_UI_VERSION } from "./site-ui-version";
import { _ensurePortalDomainKeyword } from "./_ensure-portal-domain-keyword";
import { updateItem, IUpdateItemResponse } from "@esri/arcgis-rest-portal";
import { getSiteById } from "./get-site-by-id";

/**
 * Update an existing site item
 * This function supports the equivalent of a PATCH REST operation
 * It will fetch the current item from ago, and then apply
 * a subset of property changes to the model if a allowList is included.
 * The allowList can include any property paths on the item.
 * If the list is empty, then the entire site model is overwritten.
 * @param {Object} model Site Model to update
 * @param {IUpdateSiteOptions} updateSiteOptions
 */
export function updateSite(
  model: IModel,
  updateSiteOptions: IUpdateSiteOptions
): Promise<IUpdateItemResponse> {
  const allowList = updateSiteOptions.allowList || [];
  const { updateVersions = true } = updateSiteOptions;
  // apply any on-save site upgrades here...
  deepSet(model, "data.values.uiVersion", SITE_UI_VERSION);
  deepSet(model, "data.values.updatedAt", new Date().toISOString());
  deepSet(
    model,
    "data.values.updatedBy",
    updateSiteOptions.authentication.username
  );

  // we only add these in if an allowList was passed in
  if (allowList.length) {
    allowList.push("data.values.updatedAt");
    allowList.push("data.values.updatedBy");
    if (updateVersions) {
      allowList.push("data.values.uiVersion");
      // any save needs to be able to update the schema version
      // which will have been bumped if a schema migration
      // occured during the load cycle
      allowList.push("item.properties.schemaVersion");
    }
  }

  // PORTAL-ENV: no domain service so we encode the subdomain in a typeKeyword
  if (updateSiteOptions.isPortal) {
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
    agoModelPromise = getSiteById(model.item.id, updateSiteOptions);
  } else {
    // if we dont have a allowList, just resolve with the model we have
    agoModelPromise = Promise.resolve(model);
  }

  // Kick things off...
  return agoModelPromise
    .then(agoModel => {
      if (allowList.length) {
        // merge the props in the allow list into the model from AGO
        model = mergeObjects(model, agoModel, allowList);
      }
      // send the update to ago
      return updateItem({
        item: serializeModel(model),
        authentication: updateSiteOptions.authentication,
        params: { clearEmptyFields: true }
      });
    })
    .catch(err => {
      throw Error(`updateSite: Error updating site: ${err}`);
    });
}
