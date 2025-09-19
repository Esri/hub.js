import { getProp } from "../../objects/get-prop";
import { setProp } from "../../objects/set-prop";
import { cloneObject } from "../../util";
import { IPredicate } from "../types/IHubCatalog";
import { IRelativeDate } from "../types/types";
import { relativeDateToDateRange, valueToMatchOptions } from "../utils";

/**
 * @internal
 * Predicate properties that are treated as dates
 */
export const PREDICATE_DATE_PROPS = ["created", "modified", "lastlogin"];

/**
 * @internal
 * Predicate properties that are just copied forward
 */
export const PREDICATE_COPY_PROPS = [
  "bbox",
  "categoriesAsParam",
  "categoryFilter",
  "filterType",
  "isopendata",
  "isviewonly",
  "memberType",
  "name",
  "searchUserAccess",
  "searchUserName",
  "term",
  "openData", // boolean used by the OGC Search API to filter items
];

/**
 * @internal
 * Predicate properties that are not treated as match options
 */
export const PREDICATE_NON_MATCH_OPTIONS_PROPS = [
  ...PREDICATE_DATE_PROPS,
  ...PREDICATE_COPY_PROPS,
];

/**
 * @private
 * Expand a predicate
 * @param predicate
 * @returns
 */
export function expandPredicate(predicate: IPredicate): IPredicate {
  const result: IPredicate = {};

  // Do the conversion
  Object.entries(predicate).forEach(([key, value]) => {
    // Handle MatchOptions fields
    if (!PREDICATE_NON_MATCH_OPTIONS_PROPS.includes(key)) {
      setProp(key, valueToMatchOptions(value), result);
    }
    // Handle Date fields
    if (PREDICATE_DATE_PROPS.includes(key)) {
      const dateFieldValue = cloneObject(getProp(predicate, key)) as unknown;
      if (getProp(predicate, `${key}.type`) === "relative-date") {
        setProp(
          key,
          relativeDateToDateRange(dateFieldValue as IRelativeDate),
          result
        );
      } else {
        setProp(key, dateFieldValue, result);
      }
    }
    // Handle fields that are just copied forward
    if (
      PREDICATE_COPY_PROPS.includes(key) &&
      Object.prototype.hasOwnProperty.call(predicate, key)
    ) {
      setProp(key, value, result);
    }
  });
  return result;
}
