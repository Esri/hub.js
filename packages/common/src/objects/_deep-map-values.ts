import { _mapValues } from "./_map-values";

/**
 * Maps over _all_ values of an object graph
 * @param object
 * @param callback function to be called on each value
 * @param propertyPath an initial path (optional, only changes what is passed to the callback as the "path" argument)
 * @private
 */
export function _deepMapValues(
  object: Record<string, any>,
  callback: (val: any, path: string) => any,
  propertyPath?: string
) {
  propertyPath = propertyPath || "";
  if (Array.isArray(object)) {
    return object.map(deepMapValuesIteratee);
  } else if (
    object &&
    _isObject(object) &&
    !_isDate(object) &&
    !_isRegExp(object) &&
    !_isFunction(object)
  ) {
    return Object.assign({}, object, _mapValues(object, deepMapValuesIteratee));
  } else {
    return callback(object, propertyPath);
  }

  function deepMapValuesIteratee(value: any, key: string | number): any {
    const valuePath = "" + (propertyPath ? propertyPath + "." + key : key);
    return _deepMapValues(value, callback, valuePath);
  }
}

// Simple "good-enough" type checks for the tree traversal functions
// these are not bullet-proof and should not be public/docd
/**
 * Is this a string?
 * @param v
 * @private
 */
export function _isString(v: any): boolean {
  return typeof v === "string" || v instanceof String;
}

/**
 * Return if the passed entry is a Date
 * @param v
 * @private
 */
export function _isDate(v: any): boolean {
  return v instanceof Date;
}

/**
 * Is this a function?
 * @param v
 * @private
 */
export function _isFunction(v: any): boolean {
  return typeof v === "function";
}

/**
 * Is this an Object?
 * @param v
 * @private
 */
export function _isObject(v: any): boolean {
  return typeof v === "object";
}

/**
 * Is this a regexp?
 * @param v
 * @private
 */
export function _isRegExp(v: any): boolean {
  return v instanceof RegExp;
}
