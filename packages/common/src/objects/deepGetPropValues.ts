import { _deepMapValues } from ".";

/**
 * Extract all the propertie names from a UI schema so we can subset the
 * json schema to only those properties.
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
  return props;
}
