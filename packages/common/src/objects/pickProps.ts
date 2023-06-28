import { mergeObjects } from "./merge-objects";

/**
 * Pick a set of properties from an object onto a new object
 * Undefined properties are not copied
 */
export function pickProps(obj: any, props: string[]): any {
  return mergeObjects(obj, {}, props);
}
