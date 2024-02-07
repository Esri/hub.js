import { _isObject } from "./_deep-map-values";

/**
 * Compares two values deeply for equality.
 * Works for primatives, arrays and objects.
 * Not verified for other types.
 * @param a - The first value to compare.
 * @param b - The second value to compare.
 * @returns True if the values are deeply equal, false otherwise.
 */
export function deepEqual(a: any, b: any): boolean {
  // Simple comparison for primitives
  if (a === b) {
    return true;
  }
  // object checks
  if (a && b && _isObject(a) && _isObject(b)) {
    // if either are not arrays, return false
    if (Array.isArray(a) !== Array.isArray(b)) {
      return false;
    }
    const keys = Object.keys(a);
    // if key lengths are different, return false
    if (keys.length !== Object.keys(b).length) {
      return false;
    }
    // recurse on each key
    return keys.every((key) => deepEqual(a[key], b[key]));
  }
  return false;
}
