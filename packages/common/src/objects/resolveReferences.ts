import { _isDate, _isFunction, _isObject, _isRegExp } from ".";
import { cloneObject } from "../util";
import { _deepMapValues } from "./_deep-map-values";
import { getProp } from "./get-prop";

/**
 * Resolve all $use references in an object graph.
 * The $use syntax is relative to an entire object so
 * the developer must ensure they resolve the references
 * on the same graph they were defined on.
 * Put another way, you can't resolve references on a subset
 * of an object graph.
 * @param obj
 * @param ctx
 * @returns
 */
export function resolveReferences(
  obj: Record<string, any>,
  ctx?: Record<string, any>
): Record<string, any> {
  const keys = Object.keys(obj);
  ctx = ctx || cloneObject(obj);
  const newObject = keys.reduce(function (
    acc: Record<string, any>,
    currentKey
  ) {
    // if the value is an array, map over it
    if (Array.isArray(obj[currentKey])) {
      acc[currentKey] = obj[currentKey].map((entry: any) => {
        return resolveReferences(entry, ctx);
      });
    }
    // if the value is an object, resolve it's references
    else if (
      obj[currentKey] &&
      _isObject(obj[currentKey]) &&
      !_isDate(obj[currentKey]) &&
      !_isRegExp(obj[currentKey]) &&
      !_isFunction(obj[currentKey])
    ) {
      // if the value is an object it may be a reference
      if (obj[currentKey] && obj[currentKey].$use) {
        // use getProp to resolve the reference
        const useRef = getProp(ctx, obj[currentKey].$use);
        if (_isObject(useRef)) {
          // references could contain references, so resolve them
          acc[currentKey] = resolveReferences(useRef, ctx);
        } else {
          acc[currentKey] = useRef;
        }
      } else {
        acc[currentKey] = resolveReferences(obj[currentKey], ctx);
      }
    } else {
      // assign value
      acc[currentKey] = obj[currentKey];
    }

    return acc;
  },
  {});
  return newObject;
}
