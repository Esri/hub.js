/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { ISearchParams, IHubResults } from "./params";
import { UserSession } from "@esri/arcgis-rest-auth";
import { computeItemsFacets } from "./compute-items-facets";
import { agoFormatItemCollection } from "./format-item-collection";
import { getItems } from "./get-items";

/**
 * Search for Items in ArcGIS, compute facets and format the response into V3 like datasets
 *
 * @export
 * @param {ISearchParams} params (query params from hub indexer)
 * @param {UserSession} authentication
 * @returns {Promise<ISearchResult>}
 */
export async function agoSearch(
  params: ISearchParams,
  token?: string,
  portal?: string,
  authentication?: UserSession
): Promise<IHubResults> {
  const agoResponse = await getItems(params, token, portal, authentication);
  const facets = await computeItemsFacets(
    agoResponse.aggregations,
    params,
    token,
    portal
  );
  const model = agoFormatItemCollection(agoResponse, facets, params);
  return model;
}
