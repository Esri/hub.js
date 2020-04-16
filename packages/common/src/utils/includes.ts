/**
 * Checks whether a value exists in the given array
 * @param array The array
 * @param val The value
 */
export function includes(array: any[], val: any): boolean {
  return array.indexOf(val) !== -1;
}
