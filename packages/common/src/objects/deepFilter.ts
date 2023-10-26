import { isFindable } from "./internal/isFindable";
import { setProp } from "./set-prop";

/**
 * Traverse a graph filtering out entries that do
 * not pass the predicate
 *
 * example:
 * const predicate = (link: any) => link.key !== "00a"
 * const obj = [
 *   {
 *     key: "001",
 *     label: "Stop the Spotted Lanternfly",
 *   },
 *   {
 *     key: "002",
 *     label: "Create a Map",
 *     children: [
 *       {
 *         key: "00a",
 *         label: "ArcGIS Map Viewer",
 *       },
 *       {
 *         key: "00b",
 *         label: "ArcGIS Map Viewer Classic",
 *       },
 *     ],
 *   },
 * ];
 * const res = deepFilter(obj, predicate)
 * res = [
 *   {
 *     key: "001",
 *     label: "Stop the Spotted Lanternfly",
 *   },
 *   {
 *     key: "002",
 *     label: "Create a Map",
 *     children: [
 *       {
 *         key: "00b",
 *         label: "ArcGIS Map Viewer Classic",
 *       },
 *     ],
 *   },
 * ];
 *
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
      if (predicate(object[entry])) {
        if (isFindable(object[entry])) {
          const filteredEntry = deepFilter(object[entry], predicate);
          setProp(entry, filteredEntry, acc);
        } else {
          setProp(entry, object[entry], acc);
        }
      }
      return acc;
    }, {});
  } else {
    return undefined;
  }
}
