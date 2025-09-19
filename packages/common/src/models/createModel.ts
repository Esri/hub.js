import type { IUserRequestOptions } from "@esri/arcgis-rest-request";
import { createItem } from "../rest/portal/wrappers";
import { bboxToString } from "../extent";
import { IModel } from "../hub-types";
import { cloneObject } from "../util";
import { getModel } from "./getModel";

/**
 * Create an item to back and IModel.
 *
 * @param {IModel}
 * @param {IRequestOptions} requestOptions
 * @returns {Promise<IModel>}
 */
export async function createModel(
  model: IModel,
  requestOptions: IUserRequestOptions
): Promise<IModel> {
  // const clone = cloneObject(model) as IModel;
  const item = cloneObject(model.item);
  item.data = cloneObject(model.data);
  // Update extent from bbox to string
  // TODO: remove below logic once rest.js is fixed.
  if (item.extent && typeof item.extent !== "string") {
    // THIS IS A HACK TO WORK AROUND REST.JS BUG
    // and normally should never be done.
    item.extent = bboxToString(item.extent) as unknown as number[][];
  }

  // Create the item
  const createResponse = await createItem({
    item,
    ...requestOptions,
  });

  // Re-fetch the model and return that so it has all the latest prop values
  return getModel(createResponse.id, requestOptions);
}
