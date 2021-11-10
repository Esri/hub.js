import { ISearchOptions } from "@esri/arcgis-rest-portal";
import {
  Filter,
  IGroupFilterDefinition,
  IMatchOptions,
  mergeDateRange,
  mergeMatchOptions,
  mergeSearchOptions,
  relativeDateToDateRange,
  serializeDateRange,
  serializeMatchOptions,
  valueToMatchOptions,
} from ".";
import { cloneObject, getProp, setProp } from "..";

/**
 *
 * Merge `Filter<"group">` objects
 *
 * Useful in components which may get partial filters from a variety of
 * sub-components, which are then combined into a single filter prior
 * to executing the search.
 * @param filters
 * @returns
 */
export function mergeGroupFilters(
  filters: Array<Filter<"group">>
): Filter<"group"> {
  // expand all the filters so all prop types are consistent
  const expanded = filters.map(expandGroupFilter);
  // now we can merge based on fields
  const dateFields = ["created", "modified"];
  const specialFields = ["filterType", "term", ...dateFields];

  // acc is initialized as Filter<group> but also needs it
  // in the function signature... for reasons?!
  const result = expanded.reduce(
    (acc: Filter<"group">, entry) => {
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
      filterType: "group",
    } as Filter<"group">
  );

  return result;
}

/**
 * Prior to serialization into the query syntax for the backing APIs, we first expand [Filters](../Filter)
 *
 * Filter's can express their intent in a very terse form, but to ensure consistent structures
 * we expand them into their more verbose form.
 *
 * i.e. `title: "Water"` expands into `title: { any: ["Water"]}`
 *
 * - Fields defined as `string | string[] | MatchOptions` will be converted to a `MatchOptions`
 * - RelativeDate fields are converted to DateRange<number>
 *
 * @param filter
 * @returns
 */
export function expandGroupFilter(
  filter: Filter<"group">
): IGroupFilterDefinition {
  const result = {} as IGroupFilterDefinition;
  const dateProps = ["created", "modified"];
  // Some properties should not get converted to MatchOptions
  const specialProps = ["term", "searchUserAccess", ...dateProps];
  // Do the conversion

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

  // searchUserAccess is boolean, so we check if the prop exists
  // vs checking if the value is truthy
  if (filter.hasOwnProperty("searchUserAccess")) {
    result.searchUserAccess = filter.searchUserAccess;
  }

  if (filter.term) {
    result.term = filter.term;
  }

  return result;
}

/**
 * @private
 * Serialize an `IGroupFilterDefinition` into an `ISearchOptions` for use
 * with `searchGroups`
 * @param filter
 * @returns
 */
export function serializeGroupFilterForPortal(
  filter: IGroupFilterDefinition
): ISearchOptions {
  let result = {
    q: "",
    filter: "",
  } as ISearchOptions;

  const dateProps = ["created", "modified"];
  const specialProps = ["term", "searchUserAccess", "filterType", ...dateProps];
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
  // searchUserAccess is also a top-level property
  if (filter.hasOwnProperty("searchUserAccess")) {
    result.searchUserAccess = filter.searchUserAccess;
  }
  // add the term
  if (filter.term) {
    result.q = `${filter.term} ${result.q}`.trim();
  }
  return result;
}
