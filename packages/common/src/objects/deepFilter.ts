import { isFindable } from "./internal/isFindable";
import { setProp } from "./set-prop";

/**
 * Traverse a graph filtering out entities that do
 * not passes the predicate
 * @param object
 * @param predicate
 */
export function deepFilter(
  object: any,
  predicate: (object: any) => boolean
): any {
  if (Array.isArray(object)) {
    return object.reduce((acc, entry) => {
      if (predicate(entry)) {
        if (isFindable(entry)) {
          const filteredEntry = deepFilter(entry, predicate);
          acc = [...acc, filteredEntry];
        } else {
          acc = [...acc, entry];
        }
      }
      return acc;
    }, []);
  } else if (isFindable(object)) {
    return Object.keys(object).reduce((acc, entry) => {
      if (isFindable(object[entry])) {
        const filteredEntry = deepFilter(object[entry], predicate);
        setProp(entry, filteredEntry, acc);
      } else {
        setProp(entry, object[entry], acc);
      }
      return acc;
    }, {});
  } else {
    return undefined;
  }
}
