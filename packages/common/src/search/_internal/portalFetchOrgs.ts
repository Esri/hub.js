import { IPortal } from "@esri/arcgis-rest-portal";
import { fetchOrg, portalToSearchResult } from "../../org";
import { failSafe } from "../../utils";
import { batch } from "../../utils/batch";
import { getPredicateValues } from "../getPredicateValues";
import {
  IHubSearchOptions,
  IHubSearchResponse,
  IHubSearchResult,
  IQuery,
} from "../types";

/**
 * Since the portal api does not actually have a search endpoint for orgs,
 * this function simply extracts the id predicate from the query and
 * fetches the orgs that match that ids.
 * @param query
 * @param options
 */
export async function portalFetchOrgs(
  query: IQuery,
  options: IHubSearchOptions
): Promise<IHubSearchResponse<IHubSearchResult>> {
  // get the id predicate from the query
  const ids = getPredicateValues("id", query, ["any"]);

  if (!ids.length) {
    throw new Error("Organization query must contain an id predicate.");
  }

  const failSafeFetchOrg = failSafe(fetchOrg, null);

  const fetchOrgFn = async (id: string) => {
    // fetch the org
    return failSafeFetchOrg(id, options.requestOptions);
  };
  // fetch the orgs and remove any nulls from the failsafe
  const results = ((await batch(ids, fetchOrgFn, 8)) as IPortal[]).filter(
    (org) => org !== null
  );
  // convert to a search result
  return {
    total: results.length,
    hasNext: false,
    next: null,
    results: results.map((org) => portalToSearchResult(org)),
  };
}
