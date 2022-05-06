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
import {
  relativeDateToDateRange,
  serializeStringOrArray,
  valueToMatchOptions,
} from "./utils";

// Drops ~150 lines of type-specific code that will only grow as we add Events etc
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

export function serializeFilterGroupsForPortal(
  filterGroups: Array<IFilterGroup<FilterType>>
): ISearchOptions {
  const result = {
    q: "",
    filter: "",
  } as ISearchOptions;

  result.q = filterGroups.map(stringifyGroup).join(" AND ");

  return result;
}

export function stringifyGroup(group: IFilterGroup<FilterType>): string {
  const operation = group.operation || "AND";
  const filters = group.filters.map(expandFilter);
  const q = filters.map(stringifyFilter).join(` ${operation} `);
  return q;
}

export function stringifyFilter(filter: Filter<FilterType>): string {
  const dateProps = ["created", "modified"];
  const specialProps = ["filterType", "searchUserAccess", "term", ...dateProps];
  // TODO: Look at using reduce vs .map and remove the `.filter`
  const stringFilters = Object.entries(filter)
    .map(([key, value]) => {
      if (!specialProps.includes(key)) {
        return stringifyMatchOptions(key, value);
      }
      if (dateProps.includes(key)) {
        return stringifyDateRange(key, value as unknown as IDateRange<number>);
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

function stringifyMatchOptions(key: string, value: IMatchOptions): string {
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

function stringifyDateRange(key: string, range: IDateRange<number>): string {
  return `${key}:[${range.from} TO ${range.to}]`;
}
