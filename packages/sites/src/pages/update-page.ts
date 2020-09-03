import {
  IModel,
  IHubRequestOptions,
  serializeModel,
  getModel,
  getProp,
  mergeObjects
} from "@esri/hub-common";
import { updateItem, IUpdateItemResponse } from "@esri/arcgis-rest-portal";

/**
 * Update a Page item
 * @param {Object} model Page Model
 * @param {IRequestOptions} requestOptions
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
  maybePatchList: string[] | Record<string, any>,
  maybeRequestOptions?: IHubRequestOptions
): Promise<IUpdateItemResponse> {
  let patchList = maybePatchList as string[];
  let requestOptions = maybeRequestOptions;

  // support old call signature for now
  if (!Array.isArray(maybePatchList)) {
    patchList = [];
    requestOptions = maybePatchList as IHubRequestOptions;
  }

  // store info about last update and who did it
  model.data.values.updatedAt = new Date().toISOString();
  model.data.values.updatedBy = requestOptions.authentication.username;
  // nuke out the url property just for good measure
  model.item.url = "";

  let prms = Promise.resolve(model);
  if (patchList.length) {
    prms = getModel(getProp(model, "item.id"), requestOptions);
  }

  return prms.then(modelFromAGO => {
    if (patchList.length) {
      // "patch" operation
      model = mergeObjects(model, modelFromAGO, patchList);
    }
    // update it
    const opts = Object.assign({ item: serializeModel(model) }, requestOptions);
    opts.params = { clearEmptyFields: true };
    return updateItem(opts);
  });
}
