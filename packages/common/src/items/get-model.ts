import { IRequestOptions } from "@esri/arcgis-rest-request";
import { getItem, getItemData, IItem } from "@esri/arcgis-rest-portal";
import { IModel } from "../types";

/**
 * Gets the full item/data model for an item
 * @param {string} id Id of the item to fetch
 * @param {Object} requestOptions
 */
export function getModel(
  id: string,
  requestOptions: IRequestOptions
): Promise<IModel> {
  return Promise.all([
    getItem(id, requestOptions),
    getItemData(id, requestOptions)
  ]).then((result: [IItem, any]) => {
    // shape this into a model
    return {
      item: result[0],
      data: result[1]
    };
  });
}
