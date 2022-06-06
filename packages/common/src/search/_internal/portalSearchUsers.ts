import {
  ISearchOptions,
  IUserSearchOptions,
  searchUsers,
} from "@esri/arcgis-rest-portal";
import { IUser } from "@esri/arcgis-rest-types";
import { enrichUserSearchResult } from "../..";
import { enrichGroupSearchResult } from "../../groups/HubGroups";
import HubError from "../../HubError";
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
 * Portal Search implementation for Users
 * @param filterGroups
 * @param options
 */
export async function portalSearchUsers(
  filterGroups: Array<IFilterGroup<"user">>,
  options: IHubSearchOptions
): Promise<IHubSearchResponse<IHubSearchResult>> {
  // requestOptions is always required and user must be authd
  if (!options.requestOptions) {
    throw new HubError(
      "portalSearchUsers",
      "requestOptions: IHubRequestOptions is required."
    );
  }

  if (!options.requestOptions.authentication) {
    throw new HubError(
      "portalSearchUsers",
      "requestOptions must pass authentication."
    );
  }

  //

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

  // Ensure authentication gets sent
  if (!so.authentication) {
    so.authentication = options.requestOptions.authentication;
  }

  return searchPortal(so as IUserSearchOptions);
}

/**
 * Internal portal search, which then converts `IGroup`s to `IHubSearchResult`s
 * handling enrichments & includes along the way
 *
 * @param searchOptions
 * @returns
 */
async function searchPortal(
  searchOptions: IUserSearchOptions
): Promise<IHubSearchResponse<IHubSearchResult>> {
  // Execute portal search
  const resp = await searchUsers(searchOptions);

  // create mappable fn that will close
  // over the includes and requestOptions
  const fn = (user: IUser) => {
    return userToSearchResult(
      user,
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
async function userToSearchResult(
  user: IUser,
  includes: string[] = [],
  requestOptions?: IHubRequestOptions
): Promise<IHubSearchResult> {
  // Delegate to HubGroups module
  // This layer of indirection is not necessary but
  // aligns with how the items search works and
  // allows for future specialization
  return enrichUserSearchResult(user, includes, requestOptions);
}
