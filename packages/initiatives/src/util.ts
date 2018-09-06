/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */
import {
  IRequestOptions,
  getPortalUrl,
  request
} from "@esri/arcgis-rest-request";
import {
  addItemResource,
  IItemResourceAddRequestOptions,
  IItemResourceResponse,
  IItemResourceRequestOptions
} from "@esri/arcgis-rest-items";

/**
 *
 *
 * @export
 * @param {string} sourceItemId
 * @param {string} targetItemId
 * @param {string} owner
 * @param {[string]} assets
 * @param {IRequestOptions} requestOptions
 * @returns {Promise<boolean>}
 */
export function copyImageResources(
  sourceItemId: string,
  targetItemId: string,
  owner: string,
  assets: [string],
  requestOptions: IRequestOptions
): Promise<boolean> {
  // force auth
  if (!requestOptions.authentication) {
    throw new Error(`copyImageResources requires authentication.`);
  }

  const itemResourceUrl = `${getPortalUrl(
    requestOptions
  )}/content/items/${sourceItemId}/resources`;
  return requestOptions.authentication
    .getToken(itemResourceUrl)
    .then(token => {
      const assetPromises = assets.map(assetName => {
        const mimeType = getImageMimeTypeFromFileName(assetName);
        const sourceUrl = `${itemResourceUrl}/${assetName}?token=${token}`;
        return addImageAsResource(
          targetItemId,
          owner,
          assetName,
          sourceUrl,
          mimeType,
          token,
          requestOptions
        );
      });
      // This is really more of a fire-and-forget thing, as the Portal API
      // adds these requests into a queue for processing
      return Promise.all(assetPromises);
    })
    .then(() => {
      return true;
    });
}

/**
 * Given a filename of an image. return the mime-type
 *
 * @export
 * @param {string} fileName
 * @returns {string}
 */
export function getImageMimeTypeFromFileName(fileName: string): string {
  let extension = fileName.split(".")[1];
  // handle jpg
  if (extension === "jpg") {
    extension = "jpeg";
  }
  return `image/${extension}`;
}

/**
 * Load an image from a url, and store it as a resource on an existing item
 *
 * @export
 * @param {string} itemId
 * @param {string} owner
 * @param {string} filename
 * @param {string} url
 * @param {string} type
 * @param {IRequestOptions} requestOptions
 * @returns {Promise<boolean>}
 */
export function addImageAsResource(
  itemId: string,
  owner: string,
  filename: string,
  url: string,
  type: string,
  token: string,
  requestOptions: IRequestOptions
): Promise<boolean> {
  // We must use fetch directly here because AGSjs request determines how to parse
  // the response based on the `?f=<type>` param. But sending f=<anything-other-than-json>
  // to a resource end-point, throws an error. Rock, meet Hard-Place.
  const fetchOptions: RequestInit = {
    method: "GET",
    // ensures behavior mimics XMLHttpRequest. needed to support sending IWA cookies
    credentials: "same-origin"
  };
  return (
    fetch(url, fetchOptions)
      // we know it's a blob...
      .then(x => x.blob())
      .then(blob => {
        // manually construct the fetch call...
        // again, I can't seem to get the AGRjs addResource method to work
        // it does not seem to send the blob correctly, nor does it sent the
        // token in the form
        const options = {
          body: new FormData(),
          method: "POST"
        };
        const targetItemResourceUrl = `${getPortalUrl(
          requestOptions
        )}/content/users/${owner}/items/${itemId}/addResources`;
        options.body.append("file", blob, filename);
        options.body.append("filename", filename);
        options.body.append("token", token);
        options.body.append("f", "json");

        return fetch(targetItemResourceUrl, options)
          .then(x => x.json())
          .then(resp => {
            return resp.success;
          });
      })
  );
}
