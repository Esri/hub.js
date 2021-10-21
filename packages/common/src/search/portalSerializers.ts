import { ISearchOptions } from "@esri/arcgis-rest-portal";
import { cloneObject } from "../util";
import { IContentFilter, IMatchOptions, IDateRange } from "./types";

/**
 * @private
 * Serialize a `ContentFilter` into an `ISearchOptions` for use with `searchItems`
 * @param filter
 * @returns
 */
export function serializeContentFilterForPortal(
  filter: IContentFilter
): ISearchOptions {
  let searchOptions = convertContentFilterToSearchOptions(filter);

  if (filter.subFilters) {
    const subFilterOptions = filter.subFilters.reduce(
      (acc, entry) => {
        // Next guard is present b/c this can be used from javascript
        // but our tests are written in typescript which prevents us
        // from hitting the else
        /* istanbul ignore else */
        if (typeof entry === "object") {
          acc = mergeSearchOptions(
            acc,
            convertContentFilterToSearchOptions(entry),
            "OR"
          );
        }
        return acc;
      },
      { q: "", filter: "" } as ISearchOptions
    );
    // merge with searchOptions using AND
    searchOptions = mergeSearchOptions(searchOptions, subFilterOptions, "AND");
  }
  // term is always last, and pre-pended on searchOptions.q
  if (filter.term) {
    searchOptions.q = `${filter.term} ${searchOptions.q}`;
  }
  return searchOptions;
}

/**
 * @private
 * Convert a ContentFilter to a SearchOptions
 *
 * @param filter
 * @returns
 */
export function convertContentFilterToSearchOptions(
  filter: IContentFilter
): ISearchOptions {
  let result = {
    q: "",
    filter: "",
  } as ISearchOptions;

  const dateProps = ["created", "modified"];
  const specialProps = ["filterType", "subFilters", "term", ...dateProps];
  Object.entries(filter).forEach(([key, value]) => {
    // MatchOptions may go into either q or filter
    if (!specialProps.includes(key)) {
      result = mergeSearchOptions(
        result,
        serializeMatchOptions(key, value),
        "AND"
      );
    }
    // Dates only go into q
    if (dateProps.includes(key)) {
      result = mergeSearchOptions(
        result,
        serializeDateRange(key, value),
        "AND"
      );
    }
  });

  return result;
}

/**
 * @private
 * As a final `ISearchOptions` object gets created, many such objects are created, and
 * need to be systematically "merged" so as to return consistently structured `q` and `filter`
 * values.
 * @param so1
 * @param so2
 * @param join
 * @returns
 */
export function mergeSearchOptions(
  so1: ISearchOptions,
  so2: ISearchOptions,
  join: "AND" | "OR"
): ISearchOptions {
  const result = cloneObject(so1) as ISearchOptions;

  const { q, filter } = so2;
  if (q) {
    result.q = (
      (result.q ? ` (${result.q} ${join} ${q})` : q) as string
    ).trim();
  }
  if (filter) {
    result.filter = (
      result.filter ? `(${result.filter} ${join} ${filter})` : filter
    ).trim();
  }
  return result;
}

/**
 * @private
 * Serialize a `MatchOptions` into `q` or `filter` on an `ISearchOptions`
 * @param key
 * @param opts
 * @returns
 */
export function serializeMatchOptions(
  key: string,
  opts: IMatchOptions
): ISearchOptions {
  const result = {
    q: "",
    filter: "",
  } as ISearchOptions;

  if (opts.exact) {
    // defined separately for refactoring later
    const userFilterableFields = [
      "username",
      "firstname",
      "lastname",
      "fullname",
      "email",
    ];
    const itemFilterableFields = [
      "title",
      "tags",
      "typekeywords",
      "type",
      "name",
      "owner",
    ];
    const groupFilterableFields = ["title", "typekeywords", "owner"];
    const filterableFields = [
      ...userFilterableFields,
      ...itemFilterableFields,
      ...groupFilterableFields,
    ];
    if (filterableFields.includes(key)) {
      result.filter = serializeStringOrArray("AND", key, opts.exact);
    } else {
      // Treat it the same as .all
      if (typeof opts.exact === "string") {
        if (!opts.all) {
          opts.all = [];
        }
        if (typeof opts.all === "string") {
          opts.all = [opts.all];
        }
        opts.all.push(opts.exact);
      }
      if (Array.isArray(opts.exact)) {
        if (!opts.all) {
          opts.all = [];
        }
        if (typeof opts.all === "string") {
          opts.all = [opts.all];
        }
        opts.all = opts.all.concat(opts.exact);
      }
    }
  }
  // Handle the other props
  if (opts.any) {
    result.q = serializeStringOrArray("OR", key, opts.any);
  }
  if (opts.all) {
    result.q =
      (result.q ? result.q + " AND " : "") +
      serializeStringOrArray("AND", key, opts.all);
  }

  if (opts.not) {
    // negate the entries if they are not
    result.q =
      (result.q ? result.q + " AND " : "") +
      serializeStringOrArray("OR", `-${key}`, opts.not);
  }

  return result;
}

/**
 * @private
 * Serialize a DateRange<number> into a Portal Query string
 * @param key
 * @param range
 * @returns
 */
export function serializeDateRange(
  key: string,
  range: IDateRange<number>
): ISearchOptions {
  return {
    q: `${key}:[${range.from} TO ${range.to}]`,
    filter: "",
  };
}

/**
 * @private
 * Serialize a `string` or `string[]` into a string
 * @param join
 * @param key
 * @param value
 * @returns
 */
export function serializeStringOrArray(
  join: "AND" | "OR",
  key: string,
  value: string | string[]
): string {
  let q = "";
  if (Array.isArray(value)) {
    q = `(${key}:"${value.join(`" ${join} ${key}:"`)}")`;
  } else {
    q = `${key}:"${value}"`;
  }
  return q;
}
