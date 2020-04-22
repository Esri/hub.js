import { IModel, IHubRequestOptions } from "../types";
import { fetchAndUploadResource } from "./fetch-and-upload-resource";
import { UserSession } from "@esri/arcgis-rest-auth";

/**
 * Given an Item and an array of resources, upload them
 * @param {Object} itemModel Item add the resource to
 * @param {Array} resources Array of resources, with urls, to upload to the item
 * @param {Object} requestOptions {authentication}
 */
export function uploadResourcesFromUrl(
  itemModel: IModel,
  resources: Array<{ url: string; name: string }>,
  requestOptions: IHubRequestOptions
) {
  if (Array.isArray(resources)) {
    const resourcePromises = resources.reduce((acc, resource) => {
      if (resource.url) {
        const opts = {
          id: itemModel.item.id,
          owner: itemModel.item.owner,
          fileName: resource.name,
          url: resource.url,
          // TODO actually figure out this typing instead of casting
          authentication: requestOptions.authentication as UserSession
        };
        acc.push(fetchAndUploadResource(opts));
      }
      return acc;
    }, []);
    // Let them resolve...
    return Promise.all(resourcePromises);
  } else {
    return Promise.resolve([]);
  }
}
