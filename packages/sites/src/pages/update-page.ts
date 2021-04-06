import {
  IModel,
  IUpdatePageOptions,
  serializeModel,
  getModel,
  getProp,
  mergeObjects
} from "@esri/hub-common";
import { updateItem, IUpdateItemResponse } from "@esri/arcgis-rest-portal";

/**
 * Update a Page item
 * @param {Object} model Page Model
 * @param {IUpdatePageOptions} updateSiteOptions
 *
 * This function supports the equivalent of a PATCH REST operation
 * It will fetch the current item from ago, and then apply
 * a subset of property changes to the model if a patchList is included.
 * The patchList can include any property paths on the item.
 * If the list is empty, then the entire page model is overwritten.
 * TODO: Add calls to remove unused image resources
 */
export function updatePage(
  model: IModel,
  updateSiteOptions: IUpdatePageOptions
): Promise<IUpdateItemResponse> {
  const patchList = Array.isArray(updateSiteOptions.allowList)
    ? updateSiteOptions.allowList
    : [];

  // store info about last update and who did it
  model.data.values.updatedAt = new Date().toISOString();
  model.data.values.updatedBy = updateSiteOptions.authentication.username;
  // nuke out the url property just for good measure
  model.item.url = "";

  let prms = Promise.resolve(model);
  if (patchList.length) {
    prms = getModel(getProp(model, "item.id"), updateSiteOptions);
  }

  return prms.then(modelFromAGO => {
    if (patchList.length) {
      // "patch" operation
      model = mergeObjects(model, modelFromAGO, patchList);
    }
    // update it
    const opts = Object.assign(
      { item: serializeModel(model) },
      updateSiteOptions
    );
    opts.params = { clearEmptyFields: true };
    return updateItem(opts);
  });
}
