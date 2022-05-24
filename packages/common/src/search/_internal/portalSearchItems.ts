import { IItem, ISearchOptions, searchItems } from "@esri/arcgis-rest-portal";
import {
  convertPortalResponseToFacets,
  enrichContentSearchResult,
} from "../..";

import { enrichPageSearchResult } from "../../pages/HubPages";
import { enrichProjectSearchResult } from "../../projects";
import { enrichSiteSearchResult } from "../../sites";
import { IHubRequestOptions } from "../../types";
import { expandFilter, serializeFilterGroupsForPortal } from "../filter-utils";
import {
  IFilterGroup,
  IHubSearchOptions,
  IHubSearchResponse,
  IHubSearchResult,
} from "../types";
import { expandApi, getNextFunction } from "../utils";

/**
 * @private
 * Portal Search Implementation for Items
 * @param filterGroups
 * @param options
 * @returns
 */
export async function portalSearchItems(
  filterGroups: Array<IFilterGroup<"item">>,
  options: IHubSearchOptions
): Promise<IHubSearchResponse<IHubSearchResult>> {
  // API
  const api = expandApi(options.api || "arcgis");

  // Expand the individual filters in each of the groups
  const expandedGroups = filterGroups.map((fg) => {
    fg.filters = fg.filters.map(expandFilter);
    return fg;
  });

  // Serialize the all the groups for portal
  const so = serializeFilterGroupsForPortal(expandedGroups);
  // Array of properties we want to copy from IHubSearchOptions to the ISearchOptions
  const props: Array<keyof IHubSearchOptions> = [
    "authentication",
    "num",
    "sortField",
    "sortOrder",
    "include",
    "start",
    "requestOptions",
  ];
  // copy the props over
  props.forEach((prop) => {
    if (options.hasOwnProperty(prop)) {
      so[prop as keyof ISearchOptions] = options[prop];
    }
  });
  // If we don't have auth, ensure we have .portal
  if (!so.authentication) {
    so.portal = `${api.url}/sharing/rest`;
  }
  // Aggregations
  if (options.aggFields?.length) {
    so.countFields = options.aggFields.join(",");
    so.countSize = options.aggLimit || 10;
  }
  return searchPortal(so);
}

/**
 * Internal portal search, which then converts items to Content, and
 * if a Site was passed, also sets urls
 *
 * @param searchOptions
 * @param site
 * @returns
 */
async function searchPortal(
  searchOptions: ISearchOptions
): Promise<IHubSearchResponse<IHubSearchResult>> {
  // Execute portal search
  const resp = await searchItems(searchOptions);

  // create mappable fn that will handle the includes
  const fn = (item: IItem) => {
    return itemToSearchResult(
      item,
      searchOptions.includes,
      searchOptions.requestOptions
    );
  };

  // map over results
  const results = await Promise.all(resp.results.map(fn));

  // convert aggregations into facets
  const facets = convertPortalResponseToFacets(resp);

  // Construct the return
  return {
    total: resp.total,
    results,
    facets,
    hasNext: resp.nextStart > -1,
    next: getNextFunction<IHubSearchResult>(
      searchOptions,
      resp.nextStart,
      resp.total,
      searchPortal
    ),
  };
}

/**
 * Convert an Item to a IHubSearchResult
 * Fetches the includes and attaches them to the item
 * @param item
 * @param includes
 * @param requestOptions
 * @returns
 */
async function itemToSearchResult(
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
  }
  return fn(item, includes, requestOptions);
}
