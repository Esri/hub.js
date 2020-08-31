/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { request } from "@esri/arcgis-rest-request";
import { IHubContent, IHubRequestOptions } from "@esri/hub-common";
import { getContentFromHub } from "./hub";
import { getContentFromPortal } from "./portal";

/**
 * Fetch content using either the Hub API or the ArcGIS REST API
 * @param id - content (item) id
 * @param requestOptions - request options that may include authentication
 */
export function getContent(
  // TODO: this should take a slug as well
  id: string,
  requestOptions?: IHubRequestOptions
): Promise<IHubContent> {
  if (requestOptions && requestOptions.isPortal) {
    return getContentFromPortal(id, requestOptions);
  } else {
    return getContentFromHub(id, requestOptions).catch(() => {
      // TODO: inspect error?
      // dataset is not in index (i.e. might be a private item)
      // try fetching from portal instead
      return getContentFromPortal(id, requestOptions);
    });
  }
}

// TODO: remove this next breaking version
/**
 * @returns not much
 * @restlink https://developers.arcgis.com/rest/
 */
export function comingSoon(): Promise<any> {
  return request("https://www.arcgis.com/sharing/rest/info");
}
