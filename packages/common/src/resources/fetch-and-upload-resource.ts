import { addItemResource } from "@esri/arcgis-rest-portal";
import { UserSession } from "@esri/arcgis-rest-auth";
import { fetchImageAsBlob } from "./fetch-image-as-blob";

/**
 * Fetch image from a url, and upload as a resource
 * @param {Object} options {id, owner, fileName, url, authentication}
 */
export function fetchAndUploadResource(options: {
  id: string;
  owner: string;
  fileName: string;
  url: string;
  authentication: UserSession;
}) {
  // first fetch it as a blob...
  return fetchImageAsBlob(options.url).then((file: any) => {
    // upload it to the item...
    return addItemResource({
      id: options.id,
      owner: options.owner,
      name: options.fileName,
      resource: file,
      authentication: options.authentication
    });
  });
}
