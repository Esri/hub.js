/* Copyright (c) 2018-2019 Environmental Systems Research Institute, Inc.
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
 * Append or replace a value on an object, using a specified key, if the value is not null.
 * This is a very useful companion to the [getProp()](../getProp/) utility.
 *
 * Note: object that is passed in is cloned before the property is appended.
 *
 * Allows for code like:
 *
 * ```js
 * let model = {
 *  item: {
 *    title: 'some example object',
 *    description: 'this is some longer text',
 *    type: 'Web Map',
 *    properties: {
 *      sourceId: '3ef'
 *    }
 *  },
 *  data: {
 *    theme: 'orange',
 *    parcelLayer: {
 *      primaryField: 'PIN'
 *    }
 *  }
 * };
 *
 * // Let's extract some details into an object.
 * const summary = [
 *  'item.title',
 *  'item.description',
 *  'item.missingProp',
 *  'data.parcelLayer.primaryField'].reduce((acc, prop) => {
 *   // create the property name... you could do this however...
 *   let propName = prop.split('.').reverse()[0];
 *   return maybeAdd(propName, getProp(model, key), acc);
 * }, {});
 *
 * // summary =>
 * // {
 * //   title: 'some example object',
 * //   description: 'this is some longer text',
 * //   primaryField: 'PIN'
 * // }
 * ```
 * @param key - key to use when appending to the object
 * @param val - the possibly null value
 * @param target - the object to update
 */
export function maybeAdd(key: string, val: any, target: any): any {
  // see if we got something...
  if (val !== null && val !== undefined) {
    target = cloneObject(target);
    // attach using the key
    target[key] = val;
  }
  return target;
}

/**
 * Append a value to an array, if the value is not null.
 * This is a very useful companion to the [getProp()](../getProp/) utility.
 *
 * Note: the array that is passed in is cloned before being appended to.
 *
 * Allows for code like:
 * ```js
 *  // example object
 * let model = {
 *  item: {
 *    id: 'c00',
 *    title: 'some example object',
 *    description: 'this is some longer text',
 *    type: 'Web Map',
 *    properties: {
 *      sourceId: '3ef'
 *    }
 *  },
 *  data: {
 *    theme: 'orange',
 *    parcelLayer: {
 *      itemId: '7ca',
 *      primaryField: 'PIN'
 *    }
 *  }
 * };
 * // lets pluck some id's into an array...
 * maybePush(getProp(model, 'item.properties.sourceId'), []);
 * // > ['3ef']
 *
 * // now try to get a value from a property that is missing...
 * maybePush(getProp(obj, 'item.properties.childId'), []);
 * // > []
 *
 * // easily pluck values via property paths
 * const summary = [
 *  'item.id',
 *  'item.properties.sourceId',
 *  'item.properties.childId',
 *  'data.parcelLayer.itemId'].reduce((acc, prop) => {
 *   return maybePush(getProp(model, key), acc);
 * }, []);
 *
 * // summary => ['c00', '3ef', '7ca']
 *
 * ```
 *
 * @param val - the possibly null value
 * @param target - the array to add the value to
 */
export function maybePush(val: any, target: any[]): any[] {
  if (val !== null && val !== undefined) {
    // create a clone because mutation makes us sad...
    target = cloneObject(target) as any[];
    target.push(val);
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

/**
 * Determines if a value is unique in an array
 * Allows for code like:
 *
 * ```js
 * const ary = [ 1, 2, 3, 3, 4, 5, 1 ];
 *
 * const result = ary.filter(unique);
 *
 * result => [ 1, 2, 3, 4, 5 ]
 * ```
 * @param value - the value to search for
 * @param index - the index of the searched value
 * @param ary - the array to search
 * @returns {boolean} - indicating if the value is unique in the array
 */
export function unique(value: any, index: number, ary: any[]): boolean {
  return ary.indexOf(value) === index;
}

/**
 * Concatenates two arrays
 * Allows for code like:
 *
 * ```js
 * // flatten an array
 * const ary = [ [ 1, 2, 3 ], [ 3, 4, 5] , [ 1 ] ];
 *
 * const result = ary.reduce(concat);
 *
 * result => [ 1, 2, 3, 3, 4, 5, 1 ]
 * ```
 * @param ary1 - an array to concatenate
 * @param ary2 - an array to concatenate
 * @returns {any[]} - a concatenated array
 */
export function concat(ary1: any[], ary2: any[]): any[] {
  return [...ary1, ...ary2];
}
