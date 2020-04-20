import { camelize } from "../util";

/**
 * Given a string, strip out chars etc that would make it
 * and invalid javascript property name, then camelize it.
 * @param {string} value String to convert into a property
 */
export function propifyString(value: string) {
  let result = value;
  // strip off any leading numbers...
  result = result.replace(/^[0-9]*/g, "");
  // remove any rando chars...
  result = result.replace(/[^\w\s]/g, "");
  // camelize the rest...
  result = camelize(result);
  return result;
}
