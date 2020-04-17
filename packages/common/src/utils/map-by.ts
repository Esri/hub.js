/**
 * Map over an array returning the specified property for each entry
 * @param {String} prop Property to extracct
 * @param {Array} arr array of objects
 */
export function mapBy(prop: string, arr: any = []) {
  return arr.map((e: any) => e[prop]);
}
