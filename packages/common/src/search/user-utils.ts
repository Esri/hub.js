import { ISearchOptions } from "@esri/arcgis-rest-portal";
import {
  cloneObject,
  Filter,
  getProp,
  IUserFilterDefinition,
  mergeDateRange,
  mergeMatchOptions,
  mergeSearchOptions,
  relativeDateToDateRange,
  serializeDateRange,
  serializeMatchOptions,
  setProp,
  valueToMatchOptions,
} from "..";

// TODO: Remove with _searchContent
/**
 *
 * Merge `Filter<"user">` objects
 *
 * Useful in components which may get partial filters from a variety of
 * sub-components, which are then combined into a single filter prior
 * to executing the search.
 * @param filters
 * @returns
 */
export function mergeUserFilters(
  filters: Array<Filter<"user">>
): Filter<"user"> {
  // expand all the filters so all prop types are consistent
  const expanded = filters.map(expandUserFilter);
  // now we can merge based on fields
  const dateFields = ["created", "modified", "lastlogin"];
  const specialFields = ["disabled", "term", "filterType", ...dateFields];

  // acc is initialized as Filter<group> but also needs it
  // in the function signature... for reasons?!
  const result = expanded.reduce(
    (acc: Filter<"user">, entry) => {
      // process fields
      Object.entries(entry).forEach(([key, value]) => {
        // Note: getProp/setProp are used to get around
        // typescript issues with string indexing

        if (acc.hasOwnProperty(key)) {
          const existingValue = getProp(acc, key);
          // if the key is not to a special field
          if (!specialFields.includes(key)) {
            // treat as an IMatchOptions
            setProp(key, mergeMatchOptions(existingValue, value), acc);
          } else if (dateFields.includes(key)) {
            // treat as IDateRange
            setProp(key, mergeDateRange(existingValue, value), acc);
          } else if (key === "term") {
            // append terms
            acc[key] = `${acc[key]} ${value}`;
          }
        } else {
          // Acc does not have an entry for this yet
          // so just clone it
          setProp(key, cloneObject(value), acc);
        }
      });
      return acc;
    },
    {
      filterType: "user",
    } as Filter<"user">
  );

  return result;
}

/**
 * Prior to serialization into the query syntax for the backing APIs, we first expand [Filters](../Filter)
 *
 * Filter's can express their intent in a very terse form, but to ensure consistent structures
 * we expand them into their more verbose form.
 *
 * i.e. `firstname: "John"` expands into `firstname: { any: ["John"]}`
 *
 * - Fields defined as `string | string[] | MatchOptions` will be converted to a `MatchOptions`
 * - RelativeDate fields are converted to DateRange<number>
 * @param filter
 * @returns
 */
export function expandUserFilter(
  filter: Filter<"user">
): IUserFilterDefinition {
  const result = {} as IUserFilterDefinition;
  const dateProps = ["created", "modified", "lastlogin"];
  const specialProps = ["disabled", "term", ...dateProps];

  Object.entries(filter).forEach(([key, value]) => {
    // handle Matchish fields
    if (!specialProps.includes(key)) {
      // setProp side-steps typescript complaining
      setProp(key, valueToMatchOptions(value), result);
    }
    // Handle date fields
    if (dateProps.includes(key)) {
      const dateFieldValue = cloneObject(getProp(filter, key));
      if (getProp(filter, `${key}.type`) === "relative-date") {
        setProp(key, relativeDateToDateRange(dateFieldValue), result);
      } else {
        setProp(key, dateFieldValue, result);
      }
    }
  });

  // disabled is boolean, so we check if the prop exists
  // vs checking if the value is truthy
  if (filter.hasOwnProperty("disabled")) {
    result.disabled = filter.disabled;
  }
  if (filter.term) {
    result.term = filter.term;
  }
  return result;
}

/**
 * @private
 * Serialize an `IUserFilterDefinition` into an `ISearchOptions` for use
 * with `searchUsers`
 * @param filter
 * @returns
 */
export function serializeUserFilterForPortal(
  filter: IUserFilterDefinition
): ISearchOptions {
  let result = {
    q: "",
    filter: "",
  } as ISearchOptions;

  const dateProps = ["created", "modified", "lastlogin"];
  const specialProps = ["term", "filterType", ...dateProps];
  Object.entries(filter).forEach(([key, value]) => {
    // MatchOptions fields
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
  // disabled is also a top-level property
  if (filter.hasOwnProperty("disabled")) {
    result.disabled = filter.disabled;
  }
  // add the term
  if (filter.term) {
    // Note: this is slightly different from other types
    result.q = `(${filter.term}) ${result.q}`.trim();
  }

  return result;
}
