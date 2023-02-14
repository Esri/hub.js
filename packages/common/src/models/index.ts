export * from "./serializeModel";

import { IUserRequestOptions } from "@esri/arcgis-rest-auth";
import {
  createItem,
  FetchReadMethodName,
  getItem,
  getItemData,
  getItemResource,
  ICreateItemOptions,
  ICreateItemResponse,
  IItem,
  IUpdateItemOptions,
  updateItem,
} from "@esri/arcgis-rest-portal";
import { IRequestOptions } from "@esri/arcgis-rest-request";
import { bboxToString } from "../extent";
import { getItemBySlug } from "../items";
import { upsertResource } from "../resources";
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

/**
 * Takes an IModel and an array of resources and upserts them to the
 * backing item. Then searches for the resources that were upserted
 * and attaches them to the model, which is returned.
 *
 * @export
 * @param {IModel} model
 * @param {Array<{
 *     resource: any;
 *     filename: string;
 *   }>} resources
 * @param {IUserRequestOptions} requestOptions
 * @return {*}  {Promise<IModel>}
 */
export async function upsertModelResources(
  model: IModel,
  resources: Array<{
    resource: Record<string, any>;
    filename: string;
  }>,
  requestOptions: IUserRequestOptions
): Promise<IModel> {
  // Set up promises array
  const upsertPromises: Array<Promise<any>> = [];
  const expectedResourceNames: string[] = [];
  // loop through resources and create them
  resources.forEach((value: any) => {
    upsertPromises.push(
      upsertResource(
        model.item.id,
        model.item.owner,
        value.resource,
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
      return Promise.all(
        expectedResourceNames.map(async (name) => {
          return {
            name,
            resource: await getItemResource(model.item.id, {
              fileName: name,
              // Must be "arrayBuffer" | "blob" | "formData" | "json" | "text";
              readAs: name.split(".").pop() as FetchReadMethodName,
              ...requestOptions,
            }),
          };
        })
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

/**
 * Given an item, and a list of resource name/prop pairs,
 * fetch the resources and return as an object for the IModel
 *
 * @export
 * @param {IItem} item
 * @param {{
 *     [key: string]: string
 *   }} resourceNamePairs
 * @param {IRequestOptions} requestOptions
 * @return {*}  {Promise<any>}
 */
export async function fetchModelResources(
  item: IItem,
  resourceNamePairs: {
    [key: string]: string;
  },
  requestOptions: IRequestOptions
): Promise<Record<string, any>> {
  // Iterate through the resource name/prop pairs and fetch the resources
  return Object.entries(resourceNamePairs).reduce(async (acc, [key, value]) => {
    return {
      ...acc,
      [key]: await getItemResource(item.id, {
        fileName: value,
        // Must be "arrayBuffer" | "blob" | "formData" | "json" | "text";
        readAs: value.split(".").pop() as FetchReadMethodName,
        ...requestOptions,
      }),
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
