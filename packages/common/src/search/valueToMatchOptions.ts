import { IMatchOptions } from "./types/types";

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
