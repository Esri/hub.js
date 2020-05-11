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

export function _isString (v:any):boolean {
  return (typeof v === 'string' || v instanceof String);
}

export function _isDate (v:any):boolean {
  return v instanceof Date;
}

export function _isFunction (v:any):boolean {
  return typeof v === 'function';
}

export function _isObject (v:any):boolean {
  return typeof v === 'object';
}

export function _isRegExp (v:any):boolean {
  return v instanceof RegExp;
}