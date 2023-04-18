import { cloneObject } from "../util";

/**
 * Deep set function. Like Ember.set, but smarter as it will create the path
 * @param {Object} target Object we want to set the property on
 * @param {String} path Dotted path to the property we want to set
 * @param {Any} value Value we want to assign to the property
 * @param {Boolean} replace If true, replace the value at the path with the new value instead of merging
 */
export function deepSet(
  target: Record<string, any>,
  path: string,
  value: any = {},
  replace = false
) {
  const parts = path.split(".");
  let worker = target;
  const lastIdx = parts.length - 1;
  parts.forEach((p, idx) => {
    if (!worker.hasOwnProperty(p) || worker[p] == null) {
      if (idx === lastIdx) {
        worker[p] = value;
      } else {
        // keep building the path
        worker[p] = {};
      }
    } else if (idx === lastIdx) {
      if (typeof worker[p] === "object" && !Array.isArray(worker[p])) {
        if (replace) {
          // We do this to replace the value wholesale, rather than merge the two
          // This is for times where value is an object
          worker[p] = cloneObject(value);
        } else {
          worker[p] = Object.assign(worker[p], cloneObject(value));
        }
      } else {
        worker[p] = value;
      }
    }
    worker = worker[p];
  });
}
