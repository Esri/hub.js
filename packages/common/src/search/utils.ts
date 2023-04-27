/* Copyright (c) 2018-2021 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

// TODO: deprecate all private functions in this file and more them to ./_internal

import { IUser, UserSession } from "@esri/arcgis-rest-auth";
import { IGroup, ISearchOptions } from "@esri/arcgis-rest-portal";
import { ISearchResponse } from "../types";
import { cloneObject } from "../util";
import { IMatchOptions, IDateRange, IRelativeDate } from "./types/types";

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
