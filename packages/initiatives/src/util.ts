/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */
import { IAuthenticationManager, IRequestOptions, IUserRequestOptions } from "@esri/arcgis-rest-request";
import {
  addItemResource,
  IItemResourceResponse
} from "@esri/arcgis-rest-portal";
import { getPortalApiUrl } from "@esri/hub-common";
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
export function copyImageResources (
  sourceItemId: string,
  targetItemId: string,
  owner: string,
  assets: string[],
  requestOptions: IRequestOptions
): Promise<boolean> {
  const itemResourceUrl = `${getPortalApiUrl(
    requestOptions
  )}/content/items/${sourceItemId}/resources`;
  /* istanbul ignore next blob responses are difficult to make cross platform we will just have to trust the isomorphic fetch will do its job */
  return (requestOptions.authentication as IAuthenticationManager)
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
 *  Copy an set of embedded resources to an item
 *
 * @export
 * @param {string} targetItemId destination item id
 * @param {string} owner destination item owner
 * @param {any[]} assets list of assets to copy
 * @param {IRequestOptions} requestOptions
 * @returns {Promise<boolean>}
 */
export function copyEmbeddedImageResources (
  targetItemId: string,
  owner: string,
  assets: any[],
  requestOptions: IRequestOptions
): Promise<boolean> {
  // need to move resources from embedded template into AGO
  const promises = assets.map((asset: any) => {
    return addImageAsResource(
      targetItemId,
      owner,
      asset.name,
      asset.url,
      requestOptions as IUserRequestOptions
    )
      .then(() => {
        return true;
      })
      .catch(() => {
        return true; // swallow the error
      });
  });
  return Promise.all(promises).then(() => {
    return true;
  });
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
export function addImageAsResource (
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
        }).then((response: IItemResourceResponse) => {
          return response.success;
        });
      })
  );
}
