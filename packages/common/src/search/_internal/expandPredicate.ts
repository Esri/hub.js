import { getProp, setProp } from "../../objects";
import { cloneObject } from "../../util";
import { IPredicate } from "../types";
import { relativeDateToDateRange, valueToMatchOptions } from "../utils";

/**
 * @private
 * Expand a predicate
 * @param predicate
 * @returns
 */
export function expandPredicate(predicate: IPredicate): IPredicate {
  const result: IPredicate = {};
  const dateProps = ["created", "modified", "lastlogin"];
  const copyProps = [
    "filterType",
    "categoriesAsParam",
    "categoryFilter",
    "term",
    "searchUserAccess",
    "isopendata",
    "searchUserName",
    "bbox",
    "isviewonly",
  ];
  const nonMatchOptionsFields = [...dateProps, ...copyProps];
  // Do the conversion
  Object.entries(predicate).forEach(([key, value]) => {
    // Handle MatchOptions fields
    if (!nonMatchOptionsFields.includes(key)) {
      setProp(key, valueToMatchOptions(value), result);
    }
    // Handle Date fields
    if (dateProps.includes(key)) {
      const dateFieldValue = cloneObject(getProp(predicate, key));
      if (getProp(predicate, `${key}.type`) === "relative-date") {
        setProp(key, relativeDateToDateRange(dateFieldValue), result);
      } else {
        setProp(key, dateFieldValue, result);
      }
    }
    // Handle fields that are just copied forward
    if (copyProps.includes(key) && predicate.hasOwnProperty(key)) {
      setProp(key, value, result);
    }
  });
  return result;
}
