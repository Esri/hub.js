/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { searchItems, ISearchResult } from "@esri/arcgis-rest-items";
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
  authentication: UserSession
): Promise<any> {
  const agoParams = encodeAgoQuery(params);
  // console.log('agoParams = ', agoParams);
  return searchItems({
    authentication,
    searchForm: agoParams
  });
}
