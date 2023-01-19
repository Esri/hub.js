import { unique } from "../util";
import { _deepMapValues } from "./_deep-map-values";

/**
 * For a given property name, extract an array of the unique values of that property
 * This was designed to work with string values, so no promises about other types
 * @param obj
 */

export function deepGetPropValues(
  obj: Record<string, any>,
  prop: string
): string[] {
  const props: string[] = [];
  _deepMapValues(obj, (value, path) => {
    // if the path ends with the property we're looking for then add it to the list
    if (path.split(".").pop() === prop) {
      props.push(value);
    }
    return value;
  });
  return props.filter(unique);
}
