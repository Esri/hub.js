import { unprotectItem, IUserItemOptions } from "@esri/arcgis-rest-portal";
import { IRequestOptions } from "@esri/arcgis-rest-request";
import { IModel } from "../types";

/**
 * Given a model, determine if it is protected, and unprotect it if it is.
 * Otherwise, just resolve with the same result.
 * @param {Object} model Model Object
 * @param {IRequestOptions} requestOptions
 */
export function unprotectModel(model: IModel, requestOptions: IRequestOptions) {
  if (model.item.protected) {
    const opts = Object.assign(
      { id: model.item.id },
      requestOptions
    ) as IUserItemOptions;
    return unprotectItem(opts);
  } else {
    // act as though we did it
    return Promise.resolve({ success: true });
  }
}
