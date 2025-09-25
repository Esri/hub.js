import type { IUserRequestOptions } from "@esri/arcgis-rest-request";
import { upsertResource } from "../resources/upsertResource";
import { IModel } from "../hub-types";

/**
 * Takes an IModel and an array of resources and upserts them to the
 * backing item. Then searches for the resources that were upserted
 * and attaches them to the model, which is returned.
 *
 * @export
 * @param {IModel} model
 * @param {Array<{
 *     resource: Record<string, any>;
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
  return Promise.all(upsertPromises).then(() => {
    // Create a new object with the resources
    const updatedResources = resources.reduce((acc: any, resource) => {
      // Get the property name from the resource name
      const prop = resource.filename.split(".").shift();
      acc[prop] = resource.resource;
      return acc;
    }, {});
    return {
      resources: updatedResources,
      ...model,
    };
  });
}
