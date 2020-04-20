import { isString, isRegExp } from "util";
import { _deepMapValues } from "./_deep-map-values";

/**
 * Iterate over an object graph, and for all string properties, search for a string,
 * and replace it with another string
 */
export function deepStringReplace(
  obj: Record<string, any>,
  stringOrRegex: string | RegExp,
  replacement: string
): Record<string, any> {
  const replacedObject = _deepMapValues(obj, function(value: any) {
    // Only string templates
    if (!isString(value)) {
      return value;
    }
    let re;
    if (isRegExp(stringOrRegex)) {
      re = stringOrRegex;
    } else {
      re = new RegExp(stringOrRegex, "g");
    }

    return value.replace(re, replacement);
  });
  return replacedObject;
}
