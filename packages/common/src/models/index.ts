export * from "./serializeModel";

import { IUser, IUserRequestOptions } from "@esri/arcgis-rest-auth";
import {
  createItem,
  getItem,
  getItemData,
  getItemResources,
  ICreateItemOptions,
  ICreateItemResponse,
  IItem,
  IUpdateItemOptions,
  updateItem,
} from "@esri/arcgis-rest-portal";
import { IRequestOptions } from "@esri/arcgis-rest-request";
import { bboxToString } from "../extent";
import { getItemBySlug } from "../items";
import { upsertResource, getResourcesByName } from "../resources";
import { IModel } from "../types";
import { cloneObject } from "../util";

/**
 * Gets the full item/data model for an item id
 * @param {string} id
 * @param {Object} requestOptions
 */
export function getModel(
  id: string,
  requestOptions: IRequestOptions
): Promise<IModel> {
  return Promise.all([
    getItem(id, requestOptions),
    getItemData(id, requestOptions),
  ]).then((result: [IItem, any]) => {
    // shape this into a model
    return {
      item: result[0],
      data: result[1],
    };
  });
}

/**
 * Get a model by it's slug
 *
 * This uses the [Filter](https://developers.arcgis.com/rest/users-groups-and-items/search-reference.htm) option of the
 * to search for an item that has a typekeyword of `slug|{slug-value}`
 *
 * This is useful for applications that want to use human-readable urls instead
 * of using item ids.
 *
 * @param slug
 * @param requestOptions
 * @returns
 */
export function getModelBySlug(
  slug: string,
  requestOptions: IRequestOptions
): Promise<IModel> {
  return getItemBySlug(slug, requestOptions)
    .then((item) => {
      const prms = [Promise.resolve(item)];
      if (item) {
        prms.push(getItemData(item.id, requestOptions));
      } else {
        prms.push(Promise.resolve(null));
      }
      return Promise.all(prms);
    })
    .then((result: any[]) => {
      if (result[0]) {
        return {
          item: result[0],
          data: result[1],
        };
      } else {
        return null;
      }
    });
}

/**
 * Create an item to back and IModel.
 *
 * @param {IModel}
 * @param {IRequestOptions} requestOptions
 * @returns {Promise<IModel>}
 */
export function createModel(
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
  const opts = {
    item,
    ...requestOptions,
  };
  return createItem(opts as ICreateItemOptions).then(
    (response: ICreateItemResponse) => {
      // re-fetch the model so all the server-set properties
      // are included in the response
      return getModel(response.id, requestOptions);
      // clone.item.created = new Date().getTime();
      // clone.item.modified = clone.item.created;
      // return clone as IModel;
    }
  );
}

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
    return getModel(item.id, requestOptions);
    // // update the modified prop
    // // this won't be exact, but it will be very close
    // clone.item.modified = new Date().getTime();
    // return clone;
  });
}

export async function upsertModelResources(
  model: IModel,
  resources: any,
  requestOptions: IUserRequestOptions
): Promise<IModel> {
  // Set up promises array
  const upsertPromises: Array<Promise<any>> = [];
  const expectedResourceNames: string[] = [];
  // loop through resources and create them
  Object.entries(resources).forEach(([key, value]: any[]) => {
    upsertPromises.push(
      upsertResource(
        model.item.id,
        model.item.owner,
        value,
        value.filename,
        requestOptions
      )
    );
    expectedResourceNames.push(value.filename);
  });
  // Promise.all to wait for all resources to be created
  return Promise.all(upsertPromises)
    .then(() => {
      // Once all resources are created, fetch them by name (getItemResources only returns the basic info on a resource)
      // getResourceByName returns the full resource for N resources.
      return getResourcesByName(
        model.item.id,
        expectedResourceNames,
        requestOptions
      );
    })
    .then((fetchedResources) => {
      // Create a new object with the resources
      const updatedResources = fetchedResources.reduce(
        (acc: any, fetchedResource) => {
          // Get the property name from the resource name
          const prop = fetchedResource.name.split(".").shift();
          return {
            ...acc,
            [prop]: fetchedResource.resource,
          };
        },
        {}
      );
      // return updated model
      return {
        resources: updatedResources,
        ...model,
      };
    });
}

/**
 * Given an Item, fetch the data json and return an IModel
 * @param item
 * @param requestOptions
 * @returns
 */
export async function fetchModelFromItem(
  item: IItem,
  requestOptions: IRequestOptions
): Promise<IModel> {
  const data = await getItemData(item.id, requestOptions);
  return {
    item,
    data,
  } as IModel;
}

export async function fetchModelResources(
  item: IItem,
  requestOptions: IRequestOptions
): Promise<any> {
  // get a list of all resources
  const resourceList = await getItemResources(item.id, requestOptions);
  // fetch all resources by name
  const resources = await getResourcesByName(
    item.id,
    resourceList.resources.map((r: any) => r.resource),
    requestOptions
  );
  // return resources as an object
  return resources.reduce((acc: any, fetchedResource) => {
    // Get the property name from the resource name
    const prop = fetchedResource.name.split(".").shift();
    return {
      ...acc,
      [prop]: fetchedResource.resource,
    };
  }, {});
}

/**
 * Given an Item, determine if there are any fields to be cleared
 *
 * @param {IItem} item
 * @return {*} boolean
 */
function shouldClearEmptyFields(item: IItem) {
  return ["description", "snippet"].some((field) => item[field] === "");
}
