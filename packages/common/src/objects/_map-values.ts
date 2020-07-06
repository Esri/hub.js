/**
 * Maps over the values of an object (one level deep)
 * @param obj
 * @param fn
 * @private
 */
export function _mapValues(
  obj: Record<string, any>,
  fn: (value: any, key: any, obj: any) => void
) {
  const keys = Object.keys(obj);
  const newObject = keys.reduce(function(acc: Record<string, any>, currentKey) {
    acc[currentKey] = fn(obj[currentKey], currentKey, obj);
    return acc;
  }, {});
  return newObject;
}
