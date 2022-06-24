import { ISearchOptions, searchGroups } from "@esri/arcgis-rest-portal";
import { IGroup } from "@esri/arcgis-rest-types";
import { HubError } from "../..";
import { enrichGroupSearchResult } from "../../groups/HubGroups";
import { IHubRequestOptions } from "../../types";
import { expandFilter, serializeFilterGroupsForPortal } from "../filter-utils";
import { expandPredicate, serializeQueryForPortal } from "../ifilter-utils";
import {
  IFilterGroup,
  IHubSearchOptions,
  IHubSearchResponse,
  IHubSearchResult,
  IQuery,
} from "../types";
import { expandApi, getNextFunction } from "../utils";

/**
 * @private
 * DEPRECATED: Use `portalSerchGroups`
 * Portal Search Implementation for Groups
 * @param filterGroups
 * @param options
 * @returns
 */
export async function portalSearchGroupsFilterGroups(
  filterGroups: Array<IFilterGroup<"group">>,
  options: IHubSearchOptions
): Promise<IHubSearchResponse<IHubSearchResult>> {
  // API
  const api = expandApi(options.api || "arcgis");

  if (!options.requestOptions) {
    if (options.authentication) {
      // create minimal requestOptions
      options.requestOptions = {
        authentication: options.authentication,
        portal: options.authentication.portal,
      };
    } else {
      options.requestOptions = {
        portal: `${api.url}/sharing/rest`,
      };
    }
  }

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
    so.portal = so.requestOptions.portal || `${api.url}/sharing/rest`;
  }

  return searchPortal(so);
}

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
    "requestOptions",
  ];
  // copy the props over
  props.forEach((prop) => {
    if (options.hasOwnProperty(prop)) {
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
    facets: [],
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
