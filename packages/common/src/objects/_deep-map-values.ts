import { isObject, isDate, isRegExp, isFunction } from "util";
import { _mapValues } from "./_map-values";

/**
 * Maps over _all_ values of an object graph
 * @param object
 * @param callback function to be called on each value
 * @param propertyPath an initial path (optional, only changes what is passed to the callback as the "path" argument)
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
    isObject(object) &&
    !isDate(object) &&
    !isRegExp(object) &&
    !isFunction(object)
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
