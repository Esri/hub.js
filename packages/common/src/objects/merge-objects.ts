import { getProp } from './get-prop';
import { deepSet } from './deep-set';

/**
 * Apply a specified set properties from a source object to a target object
 *
 * @param {Object} source The source object
 * @param {Object} target The target object
 * @param {Array} allowList Array of property paths (if not provided, source returned)
 */
export function mergeObjects(
  source: any,
  target: any,
  allowList?: string[]
) {
  if (Array.isArray(allowList) && allowList.length) {
    // we iterate the allowList, applying changes to the target from source
    allowList.forEach(prop => {
      if (getProp(source, prop) !== undefined) {
        deepSet(target, prop, getProp(source, prop));
      }
    });
    // return the modified target object
    return target;
  } else {
    // if no property paths were passed in, return the source
    return source;
  }
}
