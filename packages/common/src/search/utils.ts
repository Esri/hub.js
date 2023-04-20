/* Copyright (c) 2018-2021 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { IUser, UserSession } from "@esri/arcgis-rest-auth";
import { IGroup, ISearchOptions } from "@esri/arcgis-rest-portal";
import { ISearchResponse } from "../types";
import { cloneObject } from "../util";
import { EntityType, IHubSearchOptions } from "./types";
import {
  IMatchOptions,
  IDateRange,
  IRelativeDate,
  IWellKnownApis,
  IApiDefinition,
  NamedApis,
} from "./types/types";

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
 * Determines Which API should be hit for the given search parameters.
 * Hierarchy:
 * - Target options.api if available
 * - Target the OGC API current parameters allow
 * - Target the Portal API based off options.requestOptions.portal
 * @param targetEntity target entity of the query
 * @param options search options
 * @returns an API Definition object describing what should be targeted
 */
export function getApi(
  targetEntity: EntityType,
  options: IHubSearchOptions
): IApiDefinition {
  const {
    api,
    site,
    requestOptions: { portal },
  } = options;

  let result: IApiDefinition;
  if (api) {
    result = expandApi(api);
  } else if (shouldUseOgcApi(targetEntity, options)) {
    result = {
      type: "arcgis-hub",
      url: `${site}/api/search/v1`,
    };
  } else {
    result = { type: "arcgis", url: portal };
  }

  return result;
}

/**
 * @private
 * Determines whether the OGC API can be targeted with the given search parameters
 * @param targetEntity target entity of the query
 * @param options search options
 */
export function shouldUseOgcApi(
  targetEntity: EntityType,
  options: IHubSearchOptions
): boolean {
  const {
    site,
    requestOptions: { isPortal },
  } = options;
  return targetEntity === "item" && !!site && !isPortal;
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
 * Create a `.next()` function for a type
 * @param request
 * @param nextStart
 * @param total
 * @param fn
 * @returns
 */
export function getNextFunction<T>(
  request: ISearchOptions,
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

  // figure out the start
  clonedRequest.start = nextStart > -1 ? nextStart : total + 1;

  return (authentication?: UserSession) => {
    if (authentication) {
      clonedRequest.authentication = authentication;
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
