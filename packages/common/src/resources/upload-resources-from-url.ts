import { IModel, IHubRequestOptions, IItemResource } from "../types";
import { fetchAndUploadResource } from "./fetch-and-upload-resource";
import { fetchAndUploadThumbnail } from "./fetch-and-upload-thumbnail";
import { _addTokenToResourceUrl } from "./_add-token-to-resource-url";

/**
 * Given an Item and an array of resources, upload them
 * @param {Object} itemModel Item add the resource to
 * @param {Array} resources Array of resources, with urls, to upload to the item
 * @param {Object} requestOptions {authentication}
 */
export function uploadResourcesFromUrl(
  itemModel: IModel,
  resources: IItemResource[],
  requestOptions: IHubRequestOptions
) {
  if (Array.isArray(resources)) {
    const resourcePromises = resources.reduce((acc, resource) => {
      if (resource.url) {
        const opts = {
          id: itemModel.item.id,
          owner: itemModel.item.owner,
          fileName: resource.name,
          url: _addTokenToResourceUrl(resource.url, requestOptions),
          authentication: requestOptions.authentication
        };
        if (resource.type === "thumbnail") {
          acc.push(fetchAndUploadThumbnail(opts));
        } else {
          // treat as a resource
          acc.push(fetchAndUploadResource(opts));
        }
      }
      return acc;
    }, []);
    // Let them resolve...
    return Promise.all(resourcePromises);
  } else {
    return Promise.resolve([]);
  }
}
