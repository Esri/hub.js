/**
 * Remove empty properties from an object graph
 * @param {Object} obj Object to remove empty/null properties from
 */
export function removeEmptyProps(obj: {
  [index: string]: any;
}): { [index: string]: any } {
  // http://stackoverflow.com/questions/286141/remove-blank-attributes-from-an-object-in-javascript
  Object.keys(obj).forEach(key => {
    if (obj[key] && typeof obj[key] === "object") {
      removeEmptyProps(obj[key]);
    } else if (obj[key] == null) {
      delete obj[key];
    }
  });
  return obj;
}
