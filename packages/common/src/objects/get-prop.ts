/**
 * Get a property out of a deeply nested object
 * Does not handle anything but nested object graph
 */
export function getProp(obj: { [index: string]: any }, path: string): any {
  return path.split(".").reduce(function(prev, curr) {
    /* istanbul ignore next no need to test undefined scenario */
    return prev ? prev[curr] : undefined;
  }, obj);
}
