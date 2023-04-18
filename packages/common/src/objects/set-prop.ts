import { deepSet } from "./deep-set";

/**
 * Sets a deep object property, constructing the property path as necessary
 *
 * @param path - the path to the property we want to set
 * @param val - the value we want to set it to
 * @param obj - the target object
 * @param replace - if true, replace the value at the path with the new value instead of set
 */
export function setProp(
  path: string | string[],
  val: any,
  obj: any,
  replace = false
) {
  if (Array.isArray(path)) {
    path = path.join(".");
  }
  deepSet(obj, path, val, replace);
}
