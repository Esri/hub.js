import { ISearchOptions } from "@esri/arcgis-rest-portal";
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
  const copyProps = ["filterType", "term", "searchUserAccess"];
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
  const result = {
    q: "",
    filter: "",
  } as ISearchOptions;

  result.q = filterGroups.map(serializeGroup).join(" AND ");

  return result;
}

/**
 * Serialize the filters in a FitlerGroup into a Portal Query
 * @param group
 * @returns
 */
function serializeGroup(group: IFilterGroup<FilterType>): string {
  const operation = group.operation || "AND";
  const filters = group.filters.map(expandFilter);
  let q = filters.map(serializeFilter).join(` ${operation} `);
  // Wrap in parens if there is more than one filter
  if (filters.length > 1) {
    q = `(${q})`;
  }
  return q;
}
/**
 * Serialize a Filter into a Portal Query
 * @param filter
 * @returns
 */
function serializeFilter(filter: Filter<FilterType>): string {
  const dateProps = ["created", "modified"];
  const specialProps = ["filterType", "searchUserAccess", "term", ...dateProps];
  // TODO: Look at using reduce vs .map and remove the `.filter`
  const stringFilters = Object.entries(filter)
    .map(([key, value]) => {
      if (!specialProps.includes(key)) {
        return serializeMatchOptions(key, value);
      }
      if (dateProps.includes(key)) {
        return serializeDateRange(key, value as unknown as IDateRange<number>);
      }
      if (key === "term") {
        return value;
      }
    })
    .filter((e) => e !== undefined);
  // eslint-disable-next-line unicorn/prefer-ternary
  if (stringFilters.length > 1) {
    return `(${stringFilters.join(" AND ")})`;
  } else {
    return stringFilters[0] as string;
  }
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
