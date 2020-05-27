import { IModel, IHubRequestOptions, serializeModel } from "@esri/hub-common";
import { updateItem, IUpdateItemResponse } from "@esri/arcgis-rest-portal";
import { removeUnusedResources } from "../layout/remove-unused-resources";

/**
 * Update a Page item
 * @param {Object} model Page Model
 * @param {IRequestOptions} requestOptions
 * TODO: Add allowList to avoid upstream collisions
 * TODO: Add calls to remove unused image resources
 */
export function updatePage(
  model: IModel,
  requestOptions: IHubRequestOptions
): Promise<IUpdateItemResponse> {
  // store info about last update and who did it
  model.data.values.updatedAt = new Date().toISOString();
  model.data.values.updatedBy = requestOptions.authentication.username;
  // nuke out the url property just for good measure
  model.item.url = "";
  // update it
  const opts = Object.assign({ item: serializeModel(model) }, requestOptions);
  return updateItem(opts).then(resp => {
    if (resp.success) {
      return removeUnusedResources(
        model.item.id,
        model.data.values.layout,
        requestOptions
      ).then(_ => {
        return resp;
      });
    } else {
      return resp;
    }
  });
}
