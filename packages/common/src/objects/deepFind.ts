import { isFindable } from "./internal/isFindable";

/**
 * Traverse a graph, locating the first entry with an `id` property that
 * has a specific string or number value
 *
 * ```js
 * const l = {
 *  one: {
 *    two: [
 *      {
 *        id: "n001",
 *        color: "red"
 *      },
 *      {
 *        id: "n002",
 *        color: "yellow"
 *      }
 *    ]
 *  }
 * };
 *
 * const config = deepFindById(l, "n002")
 * //> {id: "n002", color:"yellow"}
 * ```
 *
 * This was designed to search a Site/Page/Project layout, and return
 * the config for a card. There was some concern about the performance
 * and using a real layout object, in the test, it takes ~1.5ms to
 * do the search.
 *
 * @param object
 * @param key
 * @param value
 * @returns
 */
export function deepFindById(object: any, value: string | number): any {
  const p = (obj: any) => obj.id === value;
  return deepFind(object, p);
}

/**
 * Traverse a graph locating an entry that passes the predicate
 *
 * @param object
 * @param predicate
 * @returns
 */
export function deepFind(
  object: any,
  predicate: (object: any) => boolean
): any {
  if (Array.isArray(object)) {
    return object.reduce((acc, entry) => {
      if (predicate(entry)) {
        acc = entry;
      } else {
        if (isFindable(entry)) {
          const maybe = deepFind(entry, predicate);
          if (maybe) {
            acc = maybe;
          }
        }
      }
      return acc;
    }, undefined);
  } else if (isFindable(object)) {
    if (predicate(object)) {
      return object;
    } else {
      return Object.keys(object).reduce((acc, entry) => {
        if (isFindable(object[entry])) {
          const maybe = deepFind(object[entry], predicate);
          if (maybe) {
            acc = maybe;
          }
        }
        return acc;
      }, undefined);
    }
  } else {
    return undefined;
  }
}
