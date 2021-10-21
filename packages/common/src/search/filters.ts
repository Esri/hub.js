import { cloneObject, unique } from "../util";
import {
  IContentFilterDefinition,
  IDateRange,
  Filter,
  IMatchOptions,
  IWellKnownContentFilters,
} from "./types";
import { expandContentFilter } from "./expansions";

/**
 * Merge `Filter<"content">` objects
 * @param filters
 * @returns
 */
export function mergeContentFilter(
  filters: Array<Filter<"content">>
): Filter<"content"> {
  // expand all the filters so all prop types are consistent
  const expanded = filters.map(expandContentFilter);
  // now we can merge based on fields
  const dateFields = ["created", "modified"];
  const specialFields = ["filterType", "subFilters", ...dateFields];

  const result = expanded.reduce((acc, entry) => {
    // process fields
    Object.entries(entry).forEach(([key, value]) => {
      // MatchOption fields
      if (!specialFields.includes(key)) {
        if (acc[key]) {
          acc[key] = mergeMatchOptions(acc[key], value);
        } else {
          acc[key] = cloneObject(value);
        }
      }
      // Dates
      if (dateFields.includes(key)) {
        if (acc[key]) {
          acc[key] = mergeDateRange(acc[key], value);
        } else {
          acc[key] = cloneObject(value);
        }
      }
      // SubFilters
      if (key === "subFilters" && Array.isArray(value)) {
        if (acc.subFilters) {
          acc.subFilters = mergeSubFilters(acc.subFilters, value);
        } else {
          acc.subFilters = cloneObject(value);
        }
      }
    });
    return acc;
  }, {} as Filter<"content">);

  result.filterType = "content";

  return result;
}

function mergeSubFilters(
  sf1: Array<IContentFilterDefinition | keyof IWellKnownContentFilters>,
  sf2: Array<IContentFilterDefinition | keyof IWellKnownContentFilters>
): Array<IContentFilterDefinition | keyof IWellKnownContentFilters> {
  // Naieve: we just merge the arrays
  // in the future we may try to de-dupe things as a safeguard
  return [...sf1, ...sf2];
}

function mergeDateRange(
  dr1: IDateRange<number>,
  dr2: IDateRange<number>
): IDateRange<number> {
  const result = cloneObject(dr1);
  // feels like there is a more concise way to do this...
  if (dr2.from < dr1.from) {
    result.from = dr2.from;
  }
  if (dr2.to > dr1.to) {
    result.to = dr2.to;
  }
  return result;
}

/**
 * @private
 * Merge two [`MatchOptions`](../MatchOptions)
 *
 * Currently a naieve implementation where the arrays are simply merged
 *
 * @param mo1
 * @param mo2
 * @returns
 */
export function mergeMatchOptions(
  mo1: IMatchOptions,
  mo2: IMatchOptions
): IMatchOptions {
  const result = {} as IMatchOptions;
  // None of these props are required, so we can't just
  // use Object.keys/.entries
  const props = ["any", "all", "not", "exact"];
  props.forEach((prop) => {
    const key = prop as keyof IMatchOptions;
    const merged = [...(mo1[key] || []), ...(mo2[key] || [])];
    if (merged.length) {
      // remove any dupes and set on the return
      result[key] = merged.filter(unique);
    }
  });
  return result;
}
