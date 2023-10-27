import {
  _isString,
  _isDate,
  _isFunction,
  _isObject,
  _isRegExp,
} from "../_deep-map-values";

export function isFindable(object: any): boolean {
  let result = false;
  if (
    object &&
    _isObject(object) &&
    !_isDate(object) &&
    !_isRegExp(object) &&
    !_isFunction(object)
  ) {
    result = true;
  }
  return result;
}
