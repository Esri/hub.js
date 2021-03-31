import { deepSet } from "./deep-set";

/**
 * Sets a deep object property, constructing the property path as necessary
 *
 * @param path - the path to the property we want to set
 * @param val - the value we want to set it to
 * @param obj - the target object
 */
export function setProp(path: string | string[], val: any, obj: any) {
  if (Array.isArray(path)) {
    path = path.join(".");
  }
  deepSet(obj, path, val);
}
