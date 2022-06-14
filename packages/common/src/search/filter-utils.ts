import { ISearchOptions, SearchQueryBuilder } from "@esri/arcgis-rest-portal";
import { group } from "console";
import { getProp, setProp } from "../objects";
import { cloneObject } from "../util";
import {
  Filter,
  IFilterGroup,
  FilterType,
  IDateRange,
  IMatchOptions,
} from "./types";
import { relativeDateToDateRange, valueToMatchOptions } from "./utils";

/**
 * Expand a Filter into it's more expressive structure so it can be
 * serialized deterministically.
 *
 * Props with type `string | string[] | MatchOptions` expand into `IMatchOptions`
 * Props relative-dates are expanded into formal date-ranges
 * @param filter
 * @returns
 */
export function expandFilter<T>(filter: T): T {
  const result = {} as typeof filter;
  const dateProps = ["created", "modified", "lastlogin"];
  const copyProps = [
    "filterType",
    "term",
    "searchUserAccess",
    "isopendata",
    "searchUserName",
  ];
  const nonMatchOptionsFields = [...dateProps, ...copyProps];
  // Do the conversion
  Object.entries(filter).forEach(([key, value]) => {
    // Handle MatchOptions fields
    if (!nonMatchOptionsFields.includes(key)) {
      // setProp side-steps typescript complaining
      setProp(key, valueToMatchOptions(value), result);
    }
    // Handle Date fields
    if (dateProps.includes(key)) {
      const dateFieldValue = cloneObject(getProp(filter, key));
      if (getProp(filter, `${key}.type`) === "relative-date") {
        setProp(key, relativeDateToDateRange(dateFieldValue), result);
      } else {
        setProp(key, dateFieldValue, result);
      }
    }
    // Handle fields that are just copied forward
    if (copyProps.includes(key) && filter.hasOwnProperty(key)) {
      setProp(key, value, result);
    }
  });
  return result;
}

/**
 * Serialize a FilterGroup of any type for Portal
 * @param filterGroups
 * @returns
 */
export function serializeFilterGroupsForPortal(
  filterGroups: Array<IFilterGroup<FilterType>>
): ISearchOptions {
  const groupSearchOptions = filterGroups.map(serializeGroup);

  const result = mergeSearchOptions(groupSearchOptions, "AND");

  return result;
}

/**
 * Serialize the filters in a FitlerGroup into a Portal Query
 * @param filterGroup
 * @returns
 */
function serializeGroup(filterGroup: IFilterGroup<FilterType>): ISearchOptions {
  const operation = filterGroup.operation || "AND";
  const filters = filterGroup.filters.map(expandFilter);
  const filterSearchOptions = filters.map(serializeFilter);
  // combine these searchOptions
  const groupSearchOptions = mergeSearchOptions(filterSearchOptions, operation);
  //
  if (filters.length > 1) {
    groupSearchOptions.q = `(${groupSearchOptions.q})`;
  }
  return groupSearchOptions;
}
/**
 * Serialize a Filter into a Portal Query
 * @param filter
 * @returns
 */
function serializeFilter(filter: Filter<FilterType>): ISearchOptions {
  const dateProps = ["created", "modified"];
  const boolProps = ["isopendata"];
  const passThroughProps = ["searchUserAccess", "searchUserName"];
  const specialProps = [
    "filterType",
    "term",
    ...dateProps,
    ...boolProps,
    ...passThroughProps,
  ];
  let qCount = 0;
  // TODO: Look at using reduce vs .map and remove the `.filter`
  const opts = Object.entries(filter)
    .map(([key, value]) => {
      const so: ISearchOptions = { q: "" };
      if (!specialProps.includes(key)) {
        qCount++;
        so.q = serializeMatchOptions(key, value);
      }
      if (dateProps.includes(key)) {
        qCount++;
        so.q = serializeDateRange(key, value as unknown as IDateRange<number>);
      }
      if (boolProps.includes(key)) {
        qCount++;
        so.q = `${key}:${value}`;
      }
      if (passThroughProps.includes(key)) {
        so[key] = value;
      }
      if (key === "term") {
        qCount++;
        so.q = value;
      }
      return so;
    })
    .filter((e) => e !== undefined);

  // merge up all the searchOptions
  const searchOptions = mergeSearchOptions(opts, "AND");

  if (qCount > 1) {
    searchOptions.q = `(${searchOptions.q})`;
  }
  return searchOptions;
}

function mergeSearchOptions(
  options: ISearchOptions[],
  operation: "AND" | "OR"
): ISearchOptions {
  const result: ISearchOptions = options.reduce(
    (acc, entry) => {
      // walk the props
      Object.entries(entry).forEach(([key, value]) => {
        // if prop exists
        if (acc[key]) {
          // combine via operation
          acc[key] = `${acc[key]} ${operation} ${value}`;
        } else {
          // just copy the value
          acc[key] = value;
        }
      });

      return acc;
    },
    { q: "" }
  );

  return result;
}

/**
 * Serialize MatchOptions into portal syntax
 * @param key
 * @param value
 * @returns
 */
function serializeMatchOptions(key: string, value: IMatchOptions): string {
  let result = "";
  if (value.any) {
    result = `${serializeStringOrArray("OR", key, value.any)}`;
  }
  if (value.all) {
    result =
      (result ? result + " AND " : "") +
      `${serializeStringOrArray("AND", key, value.all)}`;
  }
  if (value.not) {
    // negate the entries if they are not
    result =
      (result ? result + " AND " : "") +
      `${serializeStringOrArray("OR", `-${key}`, value.not)}`;
  }
  // TODO HANDLE EXACT
  return result;
}

/**
 * Serialize a date-range into Portal syntax
 * @param key
 * @param range
 * @returns
 */
function serializeDateRange(key: string, range: IDateRange<number>): string {
  return `${key}:[${range.from} TO ${range.to}]`;
}

/**
 * Serialize a `string` or `string[]` into a string
 * @param join
 * @param key
 * @param value
 * @returns
 */
function serializeStringOrArray(
  join: "AND" | "OR",
  key: string,
  value: string | string[]
): string {
  let q = "";
  if (Array.isArray(value)) {
    q = `${key}:"${value.join(`" ${join} ${key}:"`)}"`;
    if (value.length > 1) {
      q = `(${q})`;
    }
  } else {
    q = `${key}:"${value}"`;
  }
  return q;
}

/**
 * Determine if a Filter is "empty"
 * @param filter
 * @returns
 */
export function isEmptyFilter(filter: Filter<FilterType>): boolean {
  // if it has one property, filterType, it's empty
  return (
    Object.keys(filter).length === 1 && filter.hasOwnProperty("filterType")
  );
}

/**
 * Determine if a filterGroup is "empty"
 * @param filterGroup
 * @returns
 */
export function isEmptyFilterGroup(
  filterGroup: IFilterGroup<FilterType>
): boolean {
  // if filters array is empty
  if (filterGroup.filters.length === 0) {
    return true;
  } else {
    // if all filters are empty
    const result = filterGroup.filters.reduce((acc, entry) => {
      if (acc) {
        acc = isEmptyFilter(entry);
      }
      return acc;
    }, true);
    return result;
  }
}
