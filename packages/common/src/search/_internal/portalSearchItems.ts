import { IItem, ISearchOptions, searchItems } from "@esri/arcgis-rest-portal";
import { serializeQueryForPortal } from "../serializeQueryForPortal";
import { enrichPageSearchResult } from "../../pages/HubPages";
import { enrichInitiativeSearchResult } from "../../initiatives/HubInitiatives";
import { enrichTemplateSearchResult } from "../../templates/fetch";
import { IHubRequestOptions } from "../../hub-types";
import {
  addDefaultItemSearchPredicates,
  getKilobyteSizeOfQuery,
  expandPortalQuery,
} from "../utils";
import { getNextPortalCallback } from "./commonHelpers/getNextPortalCallback";
import { convertPortalAggregations } from "./portalSearchUtils";
import HubError from "../../HubError";
import { enrichContentSearchResult, enrichImageSearchResult } from "../../content/search";
import { enrichProjectSearchResult } from "../../projects/fetch";
import { enrichSiteSearchResult } from "../../sites/HubSites";
import { IQuery } from "../types/IHubCatalog";
import { IHubSearchOptions } from "../types/IHubSearchOptions";
import { IHubSearchResponse } from "../types/IHubSearchResponse";
import { IHubSearchResult } from "../types/IHubSearchResult";

/**
 * @internal
 * Portal Search Implementation for Items returning IHubSearchResults
 * @param query
 * @param options
 * @returns
 */
export async function portalSearchItems(
  query: IQuery,
  options: IHubSearchOptions
): Promise<IHubSearchResponse<IHubSearchResult>> {
  const queryWithDefaultPredicates = addDefaultItemSearchPredicates(query);
  const so = processSearchParams(options, queryWithDefaultPredicates);
  return searchPortalAsHubSearchResult(so);
}

/**
 * @internal
 * Portal Search for Items using IQuery and IHubSearchOptions
 * @param query
 * @param options
 * @returns
 */
export function portalSearchItemsAsItems(
  query: IQuery,
  options: IHubSearchOptions
): Promise<IHubSearchResponse<IItem>> {
  const so = processSearchParams(options, query);
  return searchPortalAsItem(so);
}

/**
 * Common preprocessing for search options and the query
 * @param options
 * @param query
 * @returns
 */
function processSearchParams(options: IHubSearchOptions, query: IQuery) {
  if (!options.requestOptions) {
    throw new HubError(
      "portalSearchItems",
      "options.requestOptions is required."
    );
  }

  const updatedQuery = expandPortalQuery(query);

  // Serialize the all the groups for portal
  const so = serializeQueryForPortal(updatedQuery);
  // Array of properties we want to copy from IHubSearchOptions to the ISearchOptions
  const props: Array<keyof IHubSearchOptions> = [
    "num",
    "sortField",
    "sortOrder",
    "include",
    "start",
    "httpMethod",
    "requestOptions", // although requestOptions is not needed on ISearchOption we send it through so downstream fns have access to it
  ];
  // copy the props over
  props.forEach((prop) => {
    if (Object.prototype.hasOwnProperty.call(options, prop)) {
      so[prop as keyof ISearchOptions] = options[prop];
    }
  });

  if (options.requestOptions.authentication) {
    so.authentication = options.requestOptions.authentication;
  } else {
    so.portal = options.requestOptions.portal;
  }

  // Aggregations
  if (options.aggFields?.length) {
    so.countFields = options.aggFields.join(",");
    so.countSize = options.aggLimit || 10;
  }
  return so;
}

/**
 * Internal portal search, which just returns IItems witn no conversion
 * Due to typescript complexity when adding multiple returns types to a function
 * it is simpler to have two functions that do the almost the same thing.
 * @param searchOptions
 * @returns
 */
async function searchPortalAsItem(
  searchOptions: ISearchOptions
): Promise<IHubSearchResponse<IItem>> {
  // Execute portal search
  const resp = await searchItems(searchOptions);

  // convert portal  aggregations into hub aggregations
  const aggregations = convertPortalAggregations(resp);

  // Construct the return
  return {
    total: resp.total,
    results: resp.results,
    aggregations,
    hasNext: resp.nextStart > -1,
    next: getNextPortalCallback<ISearchOptions, IItem>(
      searchOptions,
      resp.nextStart,
      resp.total,
      searchPortalAsItem
    ),
    executedQuerySize: getKilobyteSizeOfQuery(searchOptions.q),
  };
}

/**
 * Internal portal search, which then converts `IItem`s to `IHubSearchResult`s
 * handling enrichments & includes along the way
 *
 * @param searchOptions
 * @returns
 */
async function searchPortalAsHubSearchResult(
  searchOptions: ISearchOptions
): Promise<IHubSearchResponse<IHubSearchResult>> {
  // Execute portal search
  const resp = await searchItems(searchOptions);

  // create mappable fn that will handle the includes
  const fn = (item: IItem) => {
    return itemToSearchResult(
      item,
      searchOptions.include,
      searchOptions.requestOptions
    );
  };

  // map over results
  const results = await Promise.all(resp.results.map(fn));

  // convert portal  aggregations into hub aggregations
  const aggregations = convertPortalAggregations(resp);

  // Construct the return
  return {
    total: resp.total,
    results,
    aggregations,
    hasNext: resp.nextStart > -1,
    next: getNextPortalCallback<ISearchOptions, IHubSearchResult>(
      searchOptions,
      resp.nextStart,
      resp.total,
      searchPortalAsHubSearchResult
    ),
    executedQuerySize: getKilobyteSizeOfQuery(searchOptions.q),
  };
}

/**
 * Convert an `IItem` to a `IHubSearchResult`
 * Fetches the enrichments, and attaches them as directed in the `include` list
 * @param item
 * @param includes
 * @param requestOptions
 * @returns
 */
export async function itemToSearchResult(
  item: IItem,
  includes: string[] = [],
  requestOptions?: IHubRequestOptions
): Promise<IHubSearchResult> {
  // based on the type, we delegate to type-specific functions
  // this allows each type to apply "default" enrichments
  let fn = enrichContentSearchResult;
  switch (item.type) {
    case "Hub Site Application":
    case "Site Application":
      fn = enrichSiteSearchResult;
      break;
    case "Hub Page":
    case "Site Page":
      fn = enrichPageSearchResult;
      break;
    case "Hub Project":
      fn = enrichProjectSearchResult;
      break;
    case "Hub Initiative":
      fn = enrichInitiativeSearchResult;
      break;
    case "Solution":
      fn = enrichTemplateSearchResult;
      break;
    // handle old hub sites
    case "Web Mapping Application":
      if (item.typeKeywords.includes("hubSite")) {
        fn = enrichSiteSearchResult;
      }
      break;
    case "Image":
      // same as content but includes fallback for thumbnail
      fn = enrichImageSearchResult;
      break;
  }
  return fn(item, includes, requestOptions);
}
