import { deepSet } from "./deep-set";

/**
 * Ensure that an object has a deep property path.
 * This will replace any existing object at the end of the path
 * @param {Object} target Object we want to ensure has some deep property
 * @param {string} path Dotted path to the property we want to ensure exists
 */
export function ensureProp(target: Record<string, any>, path: string) {
  return deepSet(target, path);
}
