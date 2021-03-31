/**
 * Sets a deep object property, constructing the property path as necessary
 *
 * @param path - the path to the property we want to set
 * @param val - the value we want to set it to
 * @param obj - the target object
 */
export function setProp(path: string | string[], val: any, obj: any): boolean {
  const props = Array.isArray(path) ? path : path.split(".");
  if (props.length > 1) {
    // does the object have this prop? if not, create it as an object
    if (!obj.hasOwnProperty(props[0])) {
      obj[props[0]] = {};
    }
    return setProp(props.slice(1), val, obj[props[0]]);
    // recurse back into this, but with one less entry in the props
  } else {
    // this is the last one, the one we want to replace
    obj[props[0]] = val;
    return true;
  }
}
