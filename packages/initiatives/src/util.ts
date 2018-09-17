/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */
import { IRequestOptions, getPortalUrl } from "@esri/arcgis-rest-request";

import { IUserRequestOptions } from "@esri/arcgis-rest-auth";
import { addItemResource } from "@esri/arcgis-rest-items";
/**
 *  Copy an set of image resources from one item to another
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
  assets: string[],
  requestOptions: IRequestOptions
): Promise<boolean> {
  const itemResourceUrl = `${getPortalUrl(
    requestOptions
  )}/content/items/${sourceItemId}/resources`;
  /* istanbul ignore next blob responses are difficult to make cross platform we will just have to trust the isomorphic fetch will do its job */
  return requestOptions.authentication
    .getToken(itemResourceUrl)
    .then(token => {
      const assetPromises = assets.map(assetName => {
        const sourceUrl = `${itemResourceUrl}/${assetName}?token=${token}`;
        return addImageAsResource(
          targetItemId,
          owner,
          assetName,
          sourceUrl,
          requestOptions as IUserRequestOptions
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
 * @param {IRequestOptions} requestOptions
 * @returns {Promise<boolean>}
 */
export function addImageAsResource(
  id: string,
  owner: string,
  name: string,
  url: string,
  requestOptions: IUserRequestOptions
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
    // -------------------------------------------------
    // request(url, opts)
    // -------------------------------------------------

    fetch(url, fetchOptions)
      .then(x => {
        return x.blob();
      })
      .then(blob => {
        return addItemResource({
          id,
          owner,
          name,
          resource: blob,
          authentication: requestOptions.authentication
        }).then(response => {
          return response.success;
        });
      })
  );
}
