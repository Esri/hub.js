/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { IRequestOptions } from "@esri/arcgis-rest-request";
import { getHubApiUrl } from "@esri/hub-common";

/**
 * Deprecated. Please use getHubApiUrl() from "@esri/hub-common"
 *
 * Based on the request options, return the hub api url
 * @param requestOptions - Request options that may have authentication manager
 * @returns string that is the url for the Hub instance
 */
export function getHubUrl(requestOptions?: IRequestOptions): string {
  return getHubApiUrl(requestOptions);
}
