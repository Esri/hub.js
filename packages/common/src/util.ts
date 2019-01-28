/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

/**
 * ```js
 * import { cloneObject } from "@esri/hub-common";
 * const original = { foo: "bar" }
 * const copy = cloneObject(original)
 * copy.foo // "bar"
 * copy === original // false
 * ```
 * Make a deep clone, including arrays. Does not handle functions!
 */
export function cloneObject(obj: { [index: string]: any }) {
  let clone: { [index: string]: any } = {};
  // first check array
  if (Array.isArray(obj)) {
    clone = obj.map(cloneObject);
  } else if (typeof obj === "object") {
    for (const i in obj) {
      if (obj[i] != null && typeof obj[i] === "object") {
        clone[i] = cloneObject(obj[i]);
      } else {
        clone[i] = obj[i];
      }
    }
  } else {
    clone = obj;
  }
  return clone;
}

/**
 * Get a property out of a deeply nested object
 * Does not handle anything but nested object graph
 */
export function getProp(obj: { [index: string]: any }, path: string): any {
  return path.split(".").reduce(function(prev, curr) {
    /* istanbul ignore next no need to test undefined scenario */
    return prev ? prev[curr] : undefined;
  }, obj);
}

/**
 * Given an array of objects, convert into an object, with each
 * entry assigned the key via the keyprop
 */
export function arrayToObject(arr: any[], key: string): any {
  return arr.reduce((hash, entry) => {
    hash[getProp(entry, key)] = entry;
    return hash;
  }, {});
}

/**
 * Given an object, convert into an array, with each
 * something or other
 */
export function objectToArray(obj: { [index: string]: any }, keyProp = "id") {
  const arr = Object.keys(obj).reduce((acc, prop) => {
    obj[prop][keyProp] = prop;
    acc.push(cloneObject(obj[prop]));
    return acc;
  }, []);
  return arr;
}

/**
 * Return an entry from an array by a property name
 */
export function findBy(arr: any[], prop: string, value: any) {
  if (!arr) {
    return null;
  }
  const res = arr.reduce((acc, entry) => {
    if (getProp(entry, prop) === value) {
      acc = entry;
    }
    return acc;
  }, null);
  return res;
}

/**
 * Return a new array without the specified value.
 *
 * @export
 * @param {any[]} arr
 * @param {*} val value or object to remove
 * @returns {any[]} Array without the value
 */
export function without(arr: any[], value: any): any[] {
  const res = arr.filter(entry => entry !== value);
  return res;
}

/**
 * Compose
 * adapted from: https://github.com/stoeffel/compose-function/blob/master/module/index.js
 */
export function compose(...fns: any[]): any {
  return fns.reduce((f, g) => (...args: any[]) => f(g(...args)));
}

/**
 * Return a random number, prefixed with a string. Used for unique identifiers that do not require
 * the rigor of a full UUID - i.e. node id's, process ids etc.
 * @param prefix String to prefix the random number with so the result is a valid javascript property
 */
export function createId(prefix: string = "i"): string {
  // prepend some char so it's always a valid dotable property name
  // get a random number, convert to base 36 representation, then grab chars 2-8
  return `${prefix}${Math.random()
    .toString(36)
    .substr(2, 8)}`;
}

/**
 * If value is not null, push it into an array, or append as a property of an object
 * Allows for code like:
 * ```js
 * const vals = maybeAdd([], getProp(obj, 'some.deep.path.thatMayBe.undefined'));
 * ```
 *
 * or
 *
 * ```js
 * let summary = {}
 * ['item.title', 'item.description', 'item.snippet'].forEach((k) => {
 *   summary = maybeAdd(summary, getProp(model, k));
 * })
 * ```
 * @param objectOrArray
 * @param val
 * @param key
 */
export function maybeAdd(
  objectOrArray: any,
  val: any,
  key: string = null
): any {
  // create a clone because mutation makes us sad...
  const target = cloneObject(objectOrArray);
  // see if we got something...
  if (val !== null && val !== undefined) {
    // is target an array?
    if (Array.isArray(target)) {
      // push it...
      target.push(val);
    } else {
      // attach using the key
      target[key] = val;
    }
  }
  return target;
}

/**
 * Convert a string to camelCase
 *
 * @export
 * @param {string} value
 * @returns {string} camelCased string
 */
export function camelize(value: string): string {
  // lower case the whole thing to start...
  value = value.toLowerCase();
  // strip out any/all special chars...
  value = value.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, " ");
  // Hoisted from EmberJS (MIT License)
  // https://github.com/emberjs/ember.js/blob/v2.0.1/packages/ember-runtime/lib/system/string.js#L23-L27
  const STRING_CAMELIZE_REGEXP_1 = /(\-|\_|\.|\s)+(.)?/g;
  const STRING_CAMELIZE_REGEXP_2 = /(^|\/)([A-Z])/g;

  return value
    .replace(STRING_CAMELIZE_REGEXP_1, function(match, separator, chr) {
      return chr ? chr.toUpperCase() : "";
    })
    .replace(STRING_CAMELIZE_REGEXP_2, function(match, separator, chr) {
      return match.toLowerCase();
    });
}
