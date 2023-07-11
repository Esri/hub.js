import { serializeQueryForPortal } from "../serializeQueryForPortal";
import {
  IHubSearchOptions,
  IHubSearchResponse,
  IHubSearchResult,
  IQuery,
} from "../types";
import {
  ISearchGroupUsersOptions,
  IUser,
  getUser,
  searchGroupUsers,
} from "@esri/arcgis-rest-portal";
import { expandPredicate } from "./expandPredicate";
import { getNextFunction } from "../utils";
import HubError from "../../HubError";
import { IHubRequestOptions } from "../../types";
import { enrichUserSearchResult } from "../../users";
import { failSafe } from "../../utils";
import { getProp, pickProps, setProp } from "../../objects";

/**
 * Search for members of a group.
 * The groupId is specified via a `group` predicate.
 * Any `term` predicate will be re-mapped to `name`.
 *
 * The backing API is very limited in what
 * it returns so this method executes the search and then tries to fetch
 * the user object directly. This is a bit slower but provides a more
 * information. Even in this case, private users may not be returned, and
 * so we have a default user that is returned in those cases.
 *
 * @param query
 * @param options
 * @returns
 */
export async function portalSearchGroupMembers(
  query: IQuery,
  options: IHubSearchOptions
): Promise<IHubSearchResponse<IHubSearchResult>> {
  // Requires that the query have a filter with a group predicate
  let groupId: string;
  query.filters.forEach((filter) => {
    filter.predicates.forEach((predicate) => {
      const prop = getProp(predicate, "group");
      if (Array.isArray(prop)) {
        // get first entry from array
        groupId = prop[0];
      } else if (typeof prop === "string") {
        // get the value as a string
        groupId = prop;
      } else if (typeof prop === "object") {
        // get the value from the object
        // get first entry from any or all array
        groupId = getProp(prop, "any[0]") || getProp(prop, "all[0]");
      }
    });
  });

  if (!groupId) {
    throw new HubError(
      "portalSearchGroupMembers",
      "Group Id required. Please pass as a predicate in the query."
    );
  }

  // Expand the individual predicates in each filter
  query.filters = query.filters.map((filter) => {
    // only `name` and `memberType` are supported
    const validPredicateKeys = ["name", "memberType"];
    filter.predicates = filter.predicates
      .map((p) => {
        // convert `term` to `name`
        if (p.term) {
          p.name = p.term;
          delete p.term;
        }
        return p;
      })
      // remove any keys that aren't supported
      .map((p) => {
        return pickProps(p, validPredicateKeys);
      })
      // remove any empty predicates
      .filter((p) => {
        return Object.entries(p).length > 0;
      })
      // expand the remaining predicates
      .map(expandPredicate);
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
  ];
  // copy the props over
  props.forEach((prop) => {
    if (options.hasOwnProperty(prop)) {
      so[prop as keyof ISearchGroupUsersOptions] = options[prop];
    }
  });

  so.groupId = groupId;
  so.requestOptions = options.requestOptions;

  // Execute search
  return searchGroupMembers(so as ISearchGroupUsersOptions);
}

/**
 * @private
 * Portal Search Implementation for Group Members
 * @param options
 */
async function searchGroupMembers(
  searchOptions: ISearchGroupUsersOptions
): Promise<IHubSearchResponse<IHubSearchResult>> {
  // searchGroupUsers needs requestOptions spread into it's options
  const opts = {
    ...searchOptions,
    ...searchOptions.requestOptions,
  } as ISearchGroupUsersOptions;
  const resp = await searchGroupUsers(searchOptions.groupId, opts);

  // create mappable fn that will close
  // over the includes and requestOptions
  const fn = (member: IGroupMember) => {
    return memberToSearchResult(
      member,
      searchOptions.include,
      searchOptions.requestOptions
    );
  };

  // map over results
  const results = await Promise.all(resp.users.map(fn));

  return {
    total: resp.total,
    results,
    hasNext: resp.nextStart > -1,
    next: getNextFunction<IHubSearchResult>(
      searchOptions,
      resp.nextStart,
      resp.total,
      searchGroupMembers
    ),
  };
}

/**
 * @private
 * Rest.js does not have a type for the response from searchGroupUsers
 * so we create one here vs just using `any`
 */
interface IGroupMember {
  username: string;
  fullName?: string;
  memberType?: string;
  joined?: number;
  orgId?: string;
  thumbnail?: string;
}

/**
 * Convert an Group Member to a IHubSearchResult
 * Fetches the backing user and uses that to populate the  user object
 * If no user is found, the object is very sparse
 * @param item
 * @param include
 * @param requestOptions
 * @returns
 */
async function memberToSearchResult(
  member: IGroupMember,
  include: string[] = [],
  requestOptions?: IHubRequestOptions
): Promise<IHubSearchResult> {
  // cross org requests may fail for non-public users
  // so we have a default user that has minimal information
  const user: IUser & Record<string, any> = {
    username: member.username,
    memberType: member.memberType || "member",
    access: "private",
    fullName: null,
    firstName: null,
    lastName: null,
    description: null,
    orgId: null,
    groups: [],
    tags: [],
    thumbnail: null,
    created: null,
    modified: null,
  };

  const fsGetUser = failSafe(getUser, user);
  const fetchedUser = await fsGetUser({
    username: member.username,
    authentication: requestOptions.authentication,
    portal: requestOptions.portal,
  });
  // Map props from the fetched user, onto the user
  // this is done because the api returns a sparse IGroupMember under some conditions
  // and we'd rather have the default user with keys present than a structure
  // with missing keys
  Object.keys(user).forEach((key) => {
    if (fetchedUser.hasOwnProperty(key) && fetchedUser[key] !== "") {
      setProp(key, fetchedUser[key], user);
    }
  });

  return enrichUserSearchResult(user, include, requestOptions);
}
