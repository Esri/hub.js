/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { searchItems, ISearchResult, IItem } from "@esri/arcgis-rest-portal";
import { ISearchParams } from "./params";
import { UserSession } from "@esri/arcgis-rest-auth";
import { encodeAgoQuery } from "./encode-ago-query";

/**
 * Search for Items in ArcGIS
 *
 * @export
 * @param {ISearchParams} params (query params from hub indexer)
 * @param {UserSession} authentication
 * @returns {Promise<ISearchResult>}
 */
export function agoSearch(
  params: ISearchParams,
  token?: string,
  portal?: string,
  authentication?: UserSession
): Promise<ISearchResult<IItem>> {
  const agoParams = encodeAgoQuery(params);
  return searchItems({
    ...agoParams,
    params: {
      token,
      countFields: agoParams.countFields,
      countSize: agoParams.countSize
    },
    portal,
    authentication
  });
}
