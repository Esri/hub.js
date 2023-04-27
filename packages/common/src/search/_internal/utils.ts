import { UserSession } from "@esri/arcgis-rest-auth";
import { ISearchOptions } from "@esri/arcgis-rest-portal";
import { ISearchResponse } from "../../types";
import { cloneObject } from "../../util";
import { IMatchOptions, IDateRange, IRelativeDate } from "../types/types";

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
