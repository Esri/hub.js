import { ISearchOptions, searchGroups } from "@esri/arcgis-rest-portal";
import type { IGroup } from "@esri/arcgis-rest-portal";
import { enrichGroupSearchResult } from "../../groups/enrichGroupSearchResult";
import HubError from "../../HubError";
import { IHubRequestOptions } from "../../hub-types";
import { serializeQueryForPortal } from "../serializeQueryForPortal";
import { getKilobyteSizeOfQuery } from "../utils";
import { expandPredicate } from "./expandPredicate";
import { getNextPortalCallback } from "./commonHelpers/getNextPortalCallback";
import { IQuery } from "../types/IHubCatalog";
import { IHubSearchOptions } from "../types/IHubSearchOptions";
import { IHubSearchResponse } from "../types/IHubSearchResponse";
import { IHubSearchResult } from "../types/IHubSearchResult";

/**
 * @private
 * Portal Search Implementation for Groups
 * @param query
 * @param options
 * @returns
 */
export async function portalSearchGroups(
  query: IQuery,
  options: IHubSearchOptions
): Promise<IHubSearchResponse<IHubSearchResult>> {
  if (!options.requestOptions) {
    throw new HubError(
      "portalSearchGroups",
      "options.requestOptions is required."
    );
  }

  // Expand the individual predicates in each filter
  query.filters = query.filters.map((filter) => {
    filter.predicates = filter.predicates.map(expandPredicate);
    return filter;
  });

  // Serialize the all the groups for portal
  const so = serializeQueryForPortal(query);
  // Array of properties we want to copy from IHubSearchOptions to the ISearchOptions
  const props: Array<keyof IHubSearchOptions> = [
    "num",
    "sortField",
    "sortOrder",
    "include",
    "start",
    "httpMethod",
    "requestOptions",
  ];
  // copy the props over
  props.forEach((prop) => {
    if (Object.prototype.hasOwnProperty.call(options, prop)) {
      so[prop as keyof ISearchOptions] = options[prop];
    }
  });

  // If we don't have auth, ensure we have .portal
  if (options.requestOptions.authentication) {
    so.authentication = options.requestOptions.authentication;
  } else {
    so.portal = options.requestOptions.portal;
  }

  return searchPortal(so);
}

/**
 * Internal portal search, which then converts `IGroup`s to `IHubSearchResult`s
 * handling enrichments & includes along the way
 *
 * @param searchOptions
 * @returns
 */
async function searchPortal(
  searchOptions: ISearchOptions
): Promise<IHubSearchResponse<IHubSearchResult>> {
  // Execute portal search
  const resp = await searchGroups(searchOptions);

  // create mappable fn that will close
  // over the includes and requestOptions
  const fn = (item: IGroup) => {
    return groupToSearchResult(
      item,
      searchOptions.include,
      searchOptions.requestOptions
    );
  };

  // map over results
  const results = await Promise.all(resp.results.map(fn));

  // Group Search does not support aggregations
  // Construct the return
  return {
    total: resp.total,
    results,

    hasNext: resp.nextStart > -1,
    next: getNextPortalCallback<ISearchOptions, IHubSearchResult>(
      searchOptions,
      resp.nextStart,
      resp.total,
      searchPortal
    ),
    executedQuerySize: getKilobyteSizeOfQuery(searchOptions.q),
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
async function groupToSearchResult(
  group: IGroup,
  includes: string[] = [],
  requestOptions?: IHubRequestOptions
): Promise<IHubSearchResult> {
  // Delegate to HubGroups module
  // This layer of indirection is not necessary but
  // aligns with how the items search works and
  // allows for future specialization
  return enrichGroupSearchResult(group, includes, requestOptions);
}
