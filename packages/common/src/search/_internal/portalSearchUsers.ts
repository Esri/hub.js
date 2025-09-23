import {
  ISearchOptions,
  ISearchResult,
  IUserSearchOptions,
  searchUsers,
  searchCommunityUsers as _searchCommunityUsers,
} from "@esri/arcgis-rest-portal";
import type { IUser } from "@esri/arcgis-rest-portal";
import { serializeQueryForPortal } from "../serializeQueryForPortal";
import HubError from "../../HubError";
import { IHubRequestOptions } from "../../hub-types";
import { getNextPortalCallback } from "./commonHelpers/getNextPortalCallback";
import { expandPredicate } from "./expandPredicate";
import { cloneObject } from "../../util";
import { getKilobyteSizeOfQuery } from "../utils";
import { enrichUserSearchResult } from "../../users/HubUsers";
import { IQuery } from "../types/IHubCatalog";
import { IHubSearchOptions } from "../types/IHubSearchOptions";
import { IHubSearchResponse } from "../types/IHubSearchResponse";
import { IHubSearchResult } from "../types/IHubSearchResult";

function buildSearchOptions(
  query: IQuery,
  options: IHubSearchOptions,
  operation: string
): IUserSearchOptions {
  // requestOptions is always required and user must be authd
  if (!options.requestOptions) {
    throw new HubError(
      operation,
      "requestOptions: IHubRequestOptions is required."
    );
  }

  if (!options.requestOptions.authentication) {
    throw new HubError(operation, "requestOptions must pass authentication.");
  }

  const clonedQuery = cloneObject(query);
  // Expand the individual predicates in each filter
  clonedQuery.filters = clonedQuery.filters.map((filter) => {
    filter.predicates = filter.predicates.map(expandPredicate);
    return filter;
  });

  // Serialize the all the groups for portal
  const so = serializeQueryForPortal(clonedQuery);
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
    if (Object.prototype.hasOwnProperty.call(options, prop)) {
      so[prop as keyof ISearchOptions] = options[prop];
    }
  });

  // Unlike Groups and Item, the Users api *requires* authentication
  // so we set it directly
  so.authentication = options.requestOptions.authentication;

  return so as IUserSearchOptions;
}

/**
 * @private
 *
 * Portal Search Implementation for Users within the currently authenticated user's organization.
 * Automatically adds "org.name as OrgName" enrichment
 *
 * DEPRECATED: This method will be deprecated in a future release, as it's not ideal to impose default enrichments in all
 * cases. When this method is depreated, all places that currently call `hubSearch` with a `targetEntity` of `user` will
 * need to be updated to use the `portalUser` `targetEntity` and explicitly pass `"org.name as OrgName"` in `inclues` to
 * preserve that enrichment, if needed. E.g.
 *
 * ```js
 * // before
 * await hubSearch(
 *   { targetEntity: "user", ... },
 *   { start: 1, ... },
 * );
 *
 * // after
 * await hubSearch(
 *   { targetEntity: "portalUser", ... },
 *   { start: 1, include: ["org.name as OrgName", ...], ... },
 * );
 * ```
 *
 * @param query An IQuery object representing the query to serialize
 * @param options An IHubSearchOptions of search options
 * @returns a promise that resolves an IHubSearchResponse<IHubSearchResult> of users results
 */
export function searchPortalUsersLegacy(
  query: IQuery,
  options: IHubSearchOptions
): Promise<IHubSearchResponse<IHubSearchResult>> {
  const searchOptions = buildSearchOptions(
    query,
    options,
    "searchPortalUsersLegacy"
  );
  // Execute search
  return searchPortal({
    ...searchOptions,
    include: ["org.name as OrgName", ...(searchOptions.include || [])],
  });
}

/**
 * @private
 *
 * Portal Search Implementation for Users within the currently authenticated user's organization.
 * No enrichments added by default.
 *
 * @param query An IQuery object representing the query to serialize
 * @param options An IHubSearchOptions of search options
 * @returns a promise that resolves an IHubSearchResponse<IHubSearchResult> of users results
 */
export function searchPortalUsers(
  query: IQuery,
  options: IHubSearchOptions
): Promise<IHubSearchResponse<IHubSearchResult>> {
  const searchOptions = buildSearchOptions(query, options, "searchPortalUsers");
  // Execute search
  return searchPortal(searchOptions);
}

/**
 * @private
 *
 * Community Search Implementation for Users within in any organization.
 * No enrichments added by default.
 *
 * @param query An IQuery object representing the query to serialize
 * @param options An IHubSearchOptions of search options
 * @returns a promise that resolves an IHubSearchResponse<IHubSearchResult> of users results
 */
export function searchCommunityUsers(
  query: IQuery,
  options: IHubSearchOptions
): Promise<IHubSearchResponse<IHubSearchResult>> {
  const searchOptions = buildSearchOptions(
    query,
    options,
    "searchCommunityUsers"
  );
  // Execute search
  return searchCommunity(searchOptions);
}

/**
 * @private
 * @param searchOptions An IUserSearchOptions object
 * @param searchResponse A ISearchResult<IUser> object
 * @returns
 */
function mapUsersToSearchResults(
  searchOptions: IUserSearchOptions,
  searchResponse: ISearchResult<IUser>
): Promise<IHubSearchResult[]> {
  // create mappable fn that will close
  // over the includes and requestOptions
  const fn = (user: IUser) =>
    userToSearchResult(
      user,
      searchOptions.include,
      searchOptions.requestOptions
    );
  return Promise.all(searchResponse.results.map(fn));
}

/**
 * Internal portal search, which then converts `IGroup`s to `IHubSearchResult`s
 * handling enrichments & includes along the way
 *
 * @param searchOptions
 * @returns a promise that resolves enriched internal portal user search results
 */
async function searchPortal(
  searchOptions: IUserSearchOptions
): Promise<IHubSearchResponse<IHubSearchResult>> {
  // Execute portal search
  const resp = await searchUsers(searchOptions);
  // map over results
  const results = await mapUsersToSearchResults(searchOptions, resp);
  // Group Search does not support aggregations
  // Construct the return
  return {
    total: resp.total,
    results,
    hasNext: resp.nextStart > -1,
    next: getNextPortalCallback<IUserSearchOptions, IHubSearchResult>(
      searchOptions,
      resp.nextStart,
      resp.total,
      searchPortal
    ),
    executedQuerySize: getKilobyteSizeOfQuery(searchOptions.q),
  };
}

/**
 * Community search, which then converts `IGroup`s to `IHubSearchResult`s
 * handling enrichments & includes along the way
 *
 * @param searchOptions
 * @returns a promise that resolves enriched community user search results
 */
async function searchCommunity(
  searchOptions: IUserSearchOptions
): Promise<IHubSearchResponse<IHubSearchResult>> {
  // Execute portal search
  const resp = await _searchCommunityUsers(searchOptions);
  // map over results
  const results = await mapUsersToSearchResults(searchOptions, resp);
  // Group Search does not support aggregations
  // Construct the return
  return {
    total: resp.total,
    results,
    hasNext: resp.nextStart > -1,
    next: getNextPortalCallback<IUserSearchOptions, IHubSearchResult>(
      searchOptions,
      resp.nextStart,
      resp.total,
      searchCommunity
    ),
    executedQuerySize: getKilobyteSizeOfQuery(searchOptions.q),
  };
}

/**
 * Convert an Item to a IHubSearchResult
 * Fetches the includes and attaches them to the item
 * @param item
 * @param include
 * @param requestOptions
 * @returns
 */
function userToSearchResult(
  user: IUser,
  include: string[] = [],
  requestOptions?: IHubRequestOptions
): Promise<IHubSearchResult> {
  // Delegate to HubUsers module
  // This layer of indirection is not necessary but
  // aligns with how the items search works and
  // allows for future specialization
  return enrichUserSearchResult(user, include, requestOptions);
}
