/* Copyright (c) 2018-2021 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

// TODO: deprecate all private functions in this file and more them to ./_internal

import { IUser, UserSession } from "@esri/arcgis-rest-auth";
import {
  IGroup,
  ISearchGroupUsersOptions,
  ISearchOptions,
} from "@esri/arcgis-rest-portal";
import { isPageType } from "../content/_internal/internalContentUtils";
import { IHubSite } from "../core";
import { getProp } from "../objects/get-prop";
import { ISearchResponse } from "../types";
import { cloneObject } from "../util";
import { IHubSearchResult } from "./types";
import { IPredicate, IQuery } from "./types/IHubCatalog";
import {
  IMatchOptions,
  IDateRange,
  IRelativeDate,
  IWellKnownApis,
  IApiDefinition,
  NamedApis,
} from "./types/types";
import { WellKnownCollection } from "./wellKnownCatalog";
import {
  isLegacySearchCategory,
  LegacySearchCategory,
} from "./_internal/commonHelpers/isLegacySearchCategory";
import { toCollectionKey } from "./_internal/commonHelpers/toCollectionKey";
import { expandQuery } from "./_internal";

/**
 * Well known APIs
 * Short-forms for specifying common APIs
 * We will likely deprecate this
 */
export const SEARCH_APIS: IWellKnownApis = {
  arcgis: {
    label: "ArcGIS Online",
    url: "https://www.arcgis.com",
    type: "arcgis",
  },
  arcgisQA: {
    label: "ArcGIS Online QAEXT",
    url: "https://qaext.arcgis.com",
    type: "arcgis",
  },
  arcgisDEV: {
    label: "ArcGIS Online DEVEXT",
    url: "https://devext.arcgis.com",
    type: "arcgis",
  },
  hub: {
    label: "ArcGIS Hub",
    url: "https://hub.arcgis.com/api",
    type: "arcgis-hub",
  },
  hubDEV: {
    label: "ArcGIS Hub DEV",
    url: "https://hubdev.arcgis.com/api",
    type: "arcgis-hub",
  },
  hubQA: {
    label: "ArcGIS Hub QA",
    url: "https://hubqa.arcgis.com/api",
    type: "arcgis-hub",
  },
};

/**
 * @private
 * Convert array of api "names" into full ApiDefinitions
 * @param apis
 * @returns
 */
export function expandApis(
  apis: Array<NamedApis | IApiDefinition>
): IApiDefinition[] {
  return apis.map(expandApi);
}

/**
 * @private
 * Convert an api "name" into a full ApiDefinition
 * @param api
 * @returns
 */
export function expandApi(api: NamedApis | IApiDefinition): IApiDefinition {
  if (typeof api === "string" && api in SEARCH_APIS) {
    return SEARCH_APIS[api];
  } else {
    // it's an object, so we trust that it's well formed
    return api as IApiDefinition;
  }
}

/**
 * @private
 * Convert a field value into a MatchOptions if it's not already one
 * @param value
 * @returns
 */
export function valueToMatchOptions(
  value: string | string[] | IMatchOptions
): IMatchOptions {
  let result = {};
  if (Array.isArray(value)) {
    result = {
      any: value,
    };
  } else {
    if (typeof value === "string") {
      result = {
        any: [value],
      };
    }
    if (typeof value === "object") {
      result = value;
    }
  }

  return result;
}

/**
 * @private
 * Convert a RelativeDate to a DateRange<number>
 * @param relative
 * @returns
 */
export function relativeDateToDateRange(
  relative: IRelativeDate
): IDateRange<number> {
  // hash of offsets
  const offsetMs = {
    min: 1000 * 60,
    hours: 1000 * 60 * 60,
    days: 1000 * 60 * 60 * 24,
    weeks: 1000 * 60 * 60 * 24 * 7,
  };
  const now = new Date();
  // default
  const result: IDateRange<number> = {
    type: "date-range",
    from: now.getTime(),
    to: now.getTime(),
  };
  //
  switch (relative.unit) {
    case "hours":
    case "days":
    case "weeks":
      result.from = result.to - offsetMs[relative.unit] * relative.num;
      break;
    case "months":
      // get the current month and subtract num
      // NOTE: when the previous month has fewer days than this month
      // setMonth() will return a date w/in the current month
      // example: 3/30 -> 3/2 b/c there is no 2/28
      now.setMonth(now.getMonth() - relative.num);
      result.from = now.getTime();
      break;
    case "years":
      now.setFullYear(now.getFullYear() - relative.num);
      result.from = now.getTime();
      break;
  }

  return result;
}

/**
 * @private
 * Create a `.next()` function for a type
 * @param request
 * @param nextStart
 * @param total
 * @param fn
 * @returns
 */
export function getNextFunction<T>(
  request: ISearchOptions | ISearchGroupUsersOptions,
  nextStart: number,
  total: number,
  fn: (r: any) => Promise<ISearchResponse<T>>
): (authentication?: UserSession) => Promise<ISearchResponse<T>> {
  const clonedRequest = cloneObject(request);

  // clone will not handle authentication so we do it manually
  if (request.authentication) {
    clonedRequest.authentication = UserSession.deserialize(
      (request.authentication as UserSession).serialize()
    );
  }
  // ensure that if we have requestOptions, we have also update the authentication on it
  if (request.requestOptions?.authentication) {
    clonedRequest.requestOptions.authentication =
      request.requestOptions.authentication;
  }

  // figure out the start
  clonedRequest.start = nextStart > -1 ? nextStart : total + 1;

  return (authentication?: UserSession) => {
    if (authentication) {
      clonedRequest.authentication = authentication;
      // ensure that if we have requestOptions, we have also update the authentication on it
      if (clonedRequest.requestOptions) {
        clonedRequest.requestOptions.authentication =
          clonedRequest.authentication;
      }
    }
    return fn(clonedRequest);
  };
}

/**
 * Construct a the full url to a group thumbnail
 *
 * - If the group has a thumbnail, construct the full url
 * - If the group is not public, append on the token (if passed in)
 * @param portalUrl
 * @param group
 * @param token
 * @returns
 */
export function getGroupThumbnailUrl(
  portalUrl: string,
  group: IGroup,
  token?: string
): string {
  let thumbnailUrl = null;
  if (group.thumbnail) {
    thumbnailUrl = `${portalUrl}/community/groups/${group.id}/info/${group.thumbnail}`;
    if (token && group.access !== "public") {
      thumbnailUrl = `${thumbnailUrl}?token=${token}`;
    }
  }
  return thumbnailUrl;
}

/**
 * Construct a the full url to a user thumbnail
 *
 * - If the user has a thumbnail, construct the full url
 * - If the user is not public, append on the token
 * @param portalUrl
 * @param user
 * @param token
 * @returns
 */
export function getUserThumbnailUrl(
  portalUrl: string,
  user: IUser,
  token?: string
): string {
  let thumbnailUrl = null;
  if (user.thumbnail) {
    thumbnailUrl = `${portalUrl}/community/users/${user.username}/info/${user.thumbnail}`;
    if (token && user.access !== "public") {
      thumbnailUrl = `${thumbnailUrl}?token=${token}`;
    }
  }
  return thumbnailUrl;
}

/**
 * Function that can migrate a legacy search category to a wellknown
 * collection key. Useful when the caller has an unknown value that
 * could either be a search category or wellknown collection.
 *
 * If the value passed is not a search category, it is returned as-is.
 *
 * @param collectionOrSearchCategory key to be migrated
 * @returns the migrated wellknown collection key
 */
export function migrateToCollectionKey(
  collectionOrSearchCategory: LegacySearchCategory | WellKnownCollection
): WellKnownCollection {
  return isLegacySearchCategory(collectionOrSearchCategory)
    ? toCollectionKey(collectionOrSearchCategory as LegacySearchCategory)
    : (collectionOrSearchCategory as WellKnownCollection);
}

/**
 * DEPRECATED: Please use `getGroupPredicate`
 * Searches through a catalog scope and retrieves the predicate responsible
 * for determining group sharing requirements.
 *
 * @param scope Catalog scope to search through
 * @returns The first predicate with a `group` field (if present)
 */
export function getScopeGroupPredicate(scope: IQuery): IPredicate {
  /* tslint:disable no-console */
  console.warn(
    `"getScopeGroupPredicate(query)" is deprecated. Please use "getGroupPredicate(qyr)`
  );
  const isGroupPredicate = (predicate: IPredicate) => !!predicate.group;
  const groupFilter = scope.filters.find((f) =>
    f.predicates.find(isGroupPredicate)
  );
  return groupFilter && groupFilter.predicates.find(isGroupPredicate);
}

/**
 * Searches through an `IQuery` and retrieves the predicate with a `group` definition.
 * If there is no group predicate, returns `null`
 * @param query IQuery to search
 * @returns
 */
export function getGroupPredicate(query: IQuery): IPredicate {
  const expandedQuery = expandQuery(query);
  const isGroupPredicate = (predicate: IPredicate) => !!predicate.group;
  const groupFilter = expandedQuery.filters.find((f) =>
    f.predicates.find(isGroupPredicate)
  );
  return groupFilter && groupFilter.predicates.find(isGroupPredicate);
}

/**
 * Determines the canonical siteRelative link for a search result.
 *
 * We need to pass in `site` specifically for Hub Page items. Unfortunately
 * for us, Hub Page items have their canonical slug stored in the corresponding
 * site's data.json, not within the Hub Page item itself.
 *
 * NOTE: The slugs generated by indexer for Hub Page items are not canonical
 * and should not be used for link generation.
 *
 * @param searchResult the search result we're calculating the link for
 * @param site IHubSite that is related to the result
 * @returns a canonical siteRelative link
 */
export function getResultSiteRelativeLink(
  searchResult: IHubSearchResult,
  site?: IHubSite
): string {
  const { id, type, typeKeywords } = searchResult;
  let siteRelativeLink = searchResult.links?.siteRelative;
  if (siteRelativeLink && isPageType(type, typeKeywords)) {
    const pages = site?.pages || [];
    const targetPage = pages.find((p) => p.id === id);
    const slug = targetPage?.slug;
    if (slug) {
      siteRelativeLink = siteRelativeLink.replace(id, slug);
    }
  }
  return siteRelativeLink;
}
