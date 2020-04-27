import { fetchImageAsBlob } from "./fetch-image-as-blob";
import { updateItem } from "@esri/arcgis-rest-portal";
import { UserSession } from "@esri/arcgis-rest-auth";

/**
 * Fetch image from a url, then upload to an item as it's thumbnail
 * @param {object} options
 */
export function fetchAndUploadThumbnail(options: {
  id: string;
  owner: string;
  fileName: string;
  url: string;
  authentication: UserSession;
}): Promise<any> {
  // first fetch it as a blob...
  return fetchImageAsBlob(options.url)
    .then(file => {
      return updateItem({
        item: {
          id: options.id,
          owner: options.owner
        },
        params: {
          fileName: options.fileName,
          thumbnail: file
        },
        authentication: options.authentication
      }).catch(_ => {
        // resolve b/c this is not crtical
        return Promise.resolve();
      });
    })
    .catch(_ => {
      return Promise.resolve();
    });
}
