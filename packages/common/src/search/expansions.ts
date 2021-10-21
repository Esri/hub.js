import { cloneObject } from "../util";
import {
  IContentFilter,
  IContentFilterDefinition,
  IDateRange,
  Filter,
  IMatchOptions,
  IRelativeDate,
  IWellKnownContentFilters,
} from "./types";

// TODO: Implement all these type expansions
const ContentFilterExpansions: IWellKnownContentFilters = {
  $storymap: [
    {
      type: "StoryMap",
    },
    {
      type: "Web Mapping Application",
      typekeywords: ["Story Map"],
    },
  ],
  $dashboard: [
    {
      type: "Dashboard",
    },
  ],
  $dataset: [],
  $experience: [],
  $site: [
    {
      type: ["Hub Site Application", "Site Application"],
    },
    {
      type: ["Web Mapping Application"],
      typekeywords: ["hubSite"],
    },
  ],
  $initiative: [],
  $document: [],
};

/**
 * Prior to serialization into the query syntax for the backing APIs, we first expand [Filters](../Filter)
 *
 * Filter's can express their intent in a very terse form, but to ensure consistent
 * into their more verbose form.
 *
 * i.e. `title: "Water"` expands into `title: { any: ["Water"]}`
 *
 * - "well known" type values are expanded
 *    - i.e. `type: "$storymap"` expands into two `subFilter` entries
 * - Fields defined as `string | string[] | MatchOptions` will be converted to a `MatchOptions`
 * - RelativeDate fields are converted to DateRange<number>
 *
 * @param filter
 * @returns
 */
export function expandContentFilter(filter: Filter<"content">): IContentFilter {
  // run any filter.type expansions first
  const expandedTypeFilter = expandTypeField(filter);

  // Expand subfilters
  // Guard - JS Clients could send in anything...
  if (Array.isArray(filter.subFilters)) {
    // Convert any strings into the coresponding ContentFilterDefinition
    expandedTypeFilter.subFilters = expandedTypeFilter.subFilters.reduce(
      (acc, entry) => {
        if (typeof entry === "string") {
          // Next guard is present b/c this can be used from javascript
          // but our tests are written in typescript which prevents us
          // from hitting the else
          /* istanbul ignore else */
          if (ContentFilterExpansions[entry]) {
            acc = acc.concat(ContentFilterExpansions[entry]);
          }
        } else {
          acc.push(entry); // should be a ContentFilterDefinition
        }
        return acc;
      },
      [] as IContentFilterDefinition[]
    );
  }
  // Convert all props into MatchOptions/DateRanges
  return convertDefinitionToFilter(expandedTypeFilter);
}

/**
 * @private
 * Expand from a well-known "type" into it's longer form
 *
 * i.e. `type: "$storymap"` expands into two subFilters entries
 *
 * @param filter
 * @returns
 */
export function expandTypeField(filter: Filter<"content">): Filter<"content"> {
  const clone = cloneObject(filter) as Filter<"content">;
  // ensure subFilters is defined as an array
  clone.subFilters = clone.subFilters || [];
  if (clone.type) {
    // if type is an Array...
    if (Array.isArray(clone.type)) {
      // remove any well-known-keys and move their expansions into
      // subfilters
      clone.type = clone.type.reduce((acc, entry) => {
        if (typeof entry === "string" && entry in ContentFilterExpansions) {
          // working with dynamic objects in typescript does require some assetions
          const key = entry as keyof typeof ContentFilterExpansions;
          clone.subFilters = clone.subFilters.concat(
            ContentFilterExpansions[key]
          );
        } else {
          acc.push(entry);
        }
        return acc;
      }, [] as string[]);
    }
    // if type is a string
    if (typeof clone.type === "string") {
      if (clone.type in ContentFilterExpansions) {
        // not sure how to make typescript happy, other than this assetion
        const key = clone.type as keyof typeof ContentFilterExpansions;
        clone.subFilters = clone.subFilters.concat(
          ContentFilterExpansions[key]
        );
        // remove it
        delete clone.type;
      }
    } else {
      // TODO: implement expansions inside MatchOptions
      // its an MatchOptions, so we just let that fall through...
      // eventually we may expand well-known types
    }
  }
  return clone;
}

/**
 * @private
 * Convert a `ContentFilterDefinition` to a `ContentFilter`
 *
 * ContentFilter is a narrower version of ContentFilterDefinition, without
 * the union types. Using a ContentFilter makes working with the structure
 * in typescript much easier.
 *
 * @param filter
 * @returns
 */
export function convertDefinitionToFilter(
  filter: IContentFilterDefinition
): IContentFilter {
  const result = {} as IContentFilter;

  if (filter.term) {
    result.term = filter.term;
  }

  const dateProps = ["created", "modified"];
  // Some properties should not get converted to MatchOptions
  const specialProps = ["filterType", "subFilters", "term", ...dateProps];
  // Do the conversion
  Object.entries(filter).forEach(([key, value]) => {
    if (!specialProps.includes(key)) {
      result[key] = valueToMatchOptions(value) as IMatchOptions;
    }
  });

  // Special Cases
  // subFilters; Array of ContentFilterDefinitions
  if (filter.subFilters && Array.isArray(filter.subFilters)) {
    // downcast - would be nice to skip this or use some other constuct
    const sf = filter.subFilters as IContentFilterDefinition[];
    result.subFilters = sf.map(convertDefinitionToFilter);
  }

  // Dates; Ensure they are all DateRange<number>
  dateProps.forEach((fld) => {
    if (filter[fld]) {
      if (filter[fld].type === "relative-date") {
        result[fld] = relativeDateToDateRange(filter[fld]);
      } else {
        result[fld] = cloneObject(filter[fld]);
      }
    }
  });

  return result;
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
 * @internal
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
