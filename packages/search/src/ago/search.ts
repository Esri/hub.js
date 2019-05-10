/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { searchItems, ISearchResult, IItem } from "@esri/arcgis-rest-portal";
import { ISearchParams, IHubResults } from "./params";
import { UserSession } from "@esri/arcgis-rest-auth";
import { encodeAgoQuery } from "./encode-ago-query";
import { computeItemsFacets } from "./compute-items-facets";
import { agoFormatItemCollection } from "./format-item-collection";

/**
 * Search for Items in ArcGIS
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
  const agoParams = encodeAgoQuery(params);
  const agoResults: ISearchResult<IItem> = await searchItems({
    ...agoParams,
    params: {
      token,
      countFields: agoParams.countFields,
      countSize: agoParams.countSize
    },
    portal,
    authentication
  });
  const facets = await computeItemsFacets(
    agoResults.aggregations,
    params,
    token,
    portal
  );
  const model = agoFormatItemCollection(agoResults, facets, params);
  return model;
}
