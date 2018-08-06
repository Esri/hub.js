/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

/**
 * Make a deep clone, including arrays. Does not handle functions!
 */
export function cloneObject(obj: any) {
  let clone = {} as any;
  // first check array
  if (Array.isArray(obj)) {
    clone = obj.map(cloneObject);
  } else if (typeof obj === "object") {
    for (const i in obj) {
      if (obj[i] != null && typeof obj[i] === "object") {
        clone[i] = cloneObject(obj[i]);
      } /* else if (Array.isArray(obj[i])) {
        clone[i] = obj[i].map(cloneObject);
      }*/ else {
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
export function getProp(obj: any, path: string) {
  return path.split(".").reduce(function(prev, curr) {
    /* istanbul ignore next no need to test undefined scenario */
    return prev ? prev[curr] : undefined;
  }, obj);
}

/**
 * Given an array of objects, convert into an object, with each
 * entry assigned the key via the keyprop
 */
export function arrayToObject(arr: any[], key: any) {
  return arr.reduce((hash, entry) => {
    hash[getProp(entry, key)] = entry;
    return hash;
  }, {});
}

/**
 * Given an object, convert into an array, with each
 * something or other
 */
export function objectToArray(obj: any, keyProp = "id") {
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
export function findBy(arr: any[], prop: any, value: any) {
  if (!arr) {
    return null;
  }
  const res = arr.reduce((acc, entry) => {
    if (entry[prop] === value) {
      acc = entry;
    }
    return acc;
  }, null);
  return res;
}

/**
 * Compose
 * adapted from: https://github.com/stoeffel/compose-function/blob/master/module/index.js
 *
 * declaring type Function[] seems preferable, but apparently thats frowned upon.
 */
export const compose = (...fns: any[]) => {
  return fns.reduce((f, g) => (...args: any[]) => f(g(...args)));
};
