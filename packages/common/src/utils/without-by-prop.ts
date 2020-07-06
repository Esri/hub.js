/**
 * Returns a new array with all the entries have the given value
 * at the given prop location removed.
 *
 * @param prop the property
 * @param val the value
 * @param arr the array
 */
export function withoutByProp(prop: string, val: any, arr: any[]) {
  return arr.filter((e: any) => {
    return e[prop] !== val;
  });
}
