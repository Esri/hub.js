import type { IUserRequestOptions } from "@esri/arcgis-rest-request";
import { getItem, IItem, IUpdateItemOptions } from "@esri/arcgis-rest-portal";
import { bboxToString } from "../extent";
import { IModel } from "../hub-types";
import { cloneObject } from "../util";
import { getModel } from "./getModel";
import { updateItem } from "../rest/portal/wrappers";

/**
 * Update an IModel. Generic function that will be used across all
 * type-specific update functions
 *
 * @export
 * @param {IModel} "model" object (i.e. `{item:{...}, data:{...}}`)
 * @param {IRequestOptions} requestOptions
 * @returns {Promise<IModel>}
 */
export function updateModel(
  model: IModel,
  requestOptions: IUserRequestOptions
): Promise<IModel> {
  // const clone = cloneObject(model);
  const item = cloneObject(model.item);
  item.data = cloneObject(model.data);
  // Update extent from bbox to string
  // TODO: remove below logic once rest.js is fixed.
  if (item.extent && typeof item.extent !== "string") {
    // THIS IS A HACK TO WORK AROUND REST.JS BUG
    // and normally should never be done.
    item.extent = bboxToString(item.extent) as unknown as number[][];
  }

  // If we have a field we are trying to clear (by making it an empty string like description / snippet)
  // We need to send clearEmptyFields: true to the updateItem call
  if (shouldClearEmptyFields(item)) {
    requestOptions.params = {
      ...requestOptions.params,
      clearEmptyFields: true,
    };
  }

  const opts = {
    item,
    ...requestOptions,
  };

  return updateItem(opts as IUpdateItemOptions).then(() => {
    // To ensure we have the exact modified timestamp, we need to
    // get the item again
    // Also, we can't just call getModel because we need to be able
    // to properly handle other types like PDFs that don't have JSON data
    return item.data
      ? getModel(item.id, requestOptions)
      : getItem(item.id, requestOptions).then((i) => ({ item: i }));
    // // update the modified prop
    // // this won't be exact, but it will be very close
    // clone.item.modified = new Date().getTime();
    // return clone;
  });
}

/**
 * Given an Item, determine if there are any fields to be cleared
 *
 * @param {IItem} item
 * @return {*} boolean
 */
function shouldClearEmptyFields(item: IItem): boolean {
  return ["description", "snippet", "tags", "categories", "licenseInfo"].some(
    (field) => item[field] === "" || item[field]?.length === 0
  );
}
