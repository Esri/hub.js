import { deepEqual } from "./deepEqual";
import { _isObject } from "./_deep-map-values";
import { isFindable } from "./internal/isFindable";

/**
 * Recursively deletes properties from an object or array that have a
 * specific value.
 *
 * Hub commonly applies migrations to entities on load. During those
 * migrations, often we want to delete properties to clean things up.
 * However, during the save process, we typically fetch the entity
 * from it's backing store and spread the migrated entity over the top of
 * the fetched entity. This results in the deleted props being re-added.
 *
 * To avoid this, instead of deleting the props in the migration,
 * we can set them to a specific value (e.g. `remove-this-prop`) and then
 * use this function to remove them, after the merge.
 *
 * @param object - The object or array to delete properties from.
 * @param value - The value to match and delete.
 * @returns The modified object or array with properties deleted.
 */
export function deepDeletePropByValue(object: any, value: any): any {
  // If the object is the value we want to delete, return undefined
  if (deepEqual(object, value)) {
    return undefined;
  }

  // If the object is an array, iterate over the array and recurse
  // on the entries
  if (Array.isArray(object)) {
    return object.reduce((acc, entry) => {
      if (isFindable(entry)) {
        const recursedObject = deepDeletePropByValue(entry, value);
        if (recursedObject !== undefined) {
          acc = [...acc, recursedObject];
        }
      } else {
        if (entry !== value) {
          acc = [...acc, entry];
        } // else we are excluding this entry
      }
      return acc;
    }, []);
  }

  if (_isObject(object)) {
    return Object.keys(object).reduce((acc, key) => {
      // if this is an object but not a date, regexp, or function, recurse
      if (isFindable(object[key]) && !deepEqual(object[key], value)) {
        const filteredEntry = deepDeletePropByValue(object[key], value);
        (acc as any)[key] = filteredEntry;
      } else {
        // ensure the value is not the value we want to delete
        if (!deepEqual(object[key], value)) {
          acc = { ...acc, [key]: object[key] };
        } // else this key matches the value and we are excluding it
      }
      return acc;
    }, {});
  } else {
    // just return the object b/c it's not something we can compare
    // e.g. a function
    return object;
  }
}
