import { IUser, UserSession } from "@esri/arcgis-rest-auth";
import {
  cloneObject,
  expandApi,
  expandUserFilter,
  Filter,
  getNextFunction,
  getUserThumbnailUrl,
  IHubSearchOptions,
  ISearchResponse,
  serializeUserFilterForPortal,
} from "..";
import {
  IUserSearchOptions,
  searchUsers as portalUserSearch,
} from "@esri/arcgis-rest-portal";

/**
 * Extends IHubSearchOptions to make auth mandatory
 */
export interface IAuthenticatedHubSearchOptions extends IHubSearchOptions {
  authentication: UserSession; // required
}

/**
 * Extends `IUser` with url optional props for the user's
 * profile and thumbnail
 */
export interface IHubUser extends IUser {
  profileUrl?: string;
  thumbnailUrl?: string;
}

/**
 * Search for Users via the Portal API.
 *
 * **Note** Authentication is required
 *
 * Note: in the future, there may be options to search via
 * a Hub specific API
 * @param filter
 * @param options
 * @returns
 */
export async function _searchUsers(
  filter: Filter<"user">,
  options: IAuthenticatedHubSearchOptions
): Promise<ISearchResponse<IHubUser>> {
  // JS Clients may not pass in authentication
  if (!options.authentication) {
    throw new Error("Authentication required to search for users.");
  }
  // expand filter so we can serialize to either api
  const expanded = expandUserFilter(filter);

  // API
  const api = expandApi(options.api || "arcgis");

  if (api.type === "arcgis") {
    const searchOptions = serializeUserFilterForPortal(
      expanded
    ) as IUserSearchOptions;
    // carry the auth forward
    searchOptions.authentication = options.authentication;

    // TODO: Dry this up - typscript makes this... inconvenient
    if (options.num) {
      searchOptions.num = options.num;
    }

    if (options.sortField) {
      searchOptions.sortField = options.sortField;
    }

    if (options.sortOrder) {
      searchOptions.sortOrder = options.sortOrder;
    }

    if (options.site) {
      searchOptions.site = cloneObject(options.site);
    }

    return searchPortalUsers(searchOptions);
  } else {
    throw new Error("_searchUsers is not implemented for non-arcgis apis");
  }
}

/**
 * Internal function that executes the user search along with
 * some simple enrichments
 * @param searchOptions
 * @returns
 */
function searchPortalUsers(
  searchOptions: IUserSearchOptions
): Promise<ISearchResponse<IHubUser>> {
  const portalUrl = searchOptions.authentication.portal;
  const token = (searchOptions.authentication as UserSession).token;

  // Partially applied functions for mapping over the results
  const userLinkify = (user: IHubUser) => {
    user.profileUrl = `${searchOptions.site.item.url}/people/${user.username}/profile`;
    return user;
  };

  const thumbnailify = (user: IHubUser) => {
    if (user.thumbnail) {
      user.thumbnailUrl = getUserThumbnailUrl(portalUrl, user, token);
    }
    return user;
  };

  return portalUserSearch(searchOptions).then((response) => {
    const hasNext: boolean = response.nextStart > -1;

    // upgrade thumbnail url
    let results = response.results.map(thumbnailify);
    // generate the site team url if site url is provided
    if (searchOptions.site?.item?.url) {
      results = response.results.map(userLinkify);
    }

    return {
      hasNext,
      total: response.total,
      results,
      next: getNextFunction<IUser>(
        searchOptions,
        response.nextStart,
        response.total,
        searchPortalUsers
      ),
    } as ISearchResponse<IUser>;
  });
}
