import {
  Filter,
  IGroupFilterDefinition,
  IMatchOptions,
  relativeDateToDateRange,
  valueToMatchOptions,
} from ".";
import { cloneObject } from "..";

export function expandGroupFilter(
  filter: IGroupFilterDefinition
): IGroupFilterDefinition {
  const result = {} as IGroupFilterDefinition;
  const dateProps = ["created", "modified"];
  // Some properties should not get converted to MatchOptions
  const specialProps = ["searchUserAccess", ...dateProps];
  // Do the conversion
  Object.entries(filter).forEach(([k, value]) => {
    const key = k as keyof IGroupFilterDefinition;
    if (!specialProps.includes(key)) {
      result[key] = valueToMatchOptions(value) as IMatchOptions;
    }
    if (dateProps.includes(key)) {
      if (typeof filter[key] === "object") {
        if (filter[key].type === "relative-date") {
        }
      }
    }
  });
  // not DRY, but typescript-- when working with things like this
  if (filter.created) {
    if (filter.created.type === "relative-date") {
      result.created = relativeDateToDateRange(filter.created);
    } else {
      result.created = cloneObject(filter.created);
    }
  }

  if (filter.modified) {
    if (filter.modified.type === "relative-date") {
      result.modified = relativeDateToDateRange(filter.modified);
    } else {
      result.modified = cloneObject(filter.modified);
    }
  }

  // searchUserAccess is boolean, so we check if the prop exists
  // vs checking if the value is truthy
  if (filter.hasOwnProperty("searchUserAccess")) {
    result.searchUserAccess = filter.searchUserAccess;
  }

  return result;
}
