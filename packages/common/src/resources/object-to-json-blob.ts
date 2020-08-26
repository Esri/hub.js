/**
 * Convert an object to a Blob with type  'application/json'
 * @param {*} obj
 * @returns Blob
 */
export function objectToJsonBlob(obj: any) {
  /* istanbul ignore next */
  if (typeof Blob !== "undefined") {
    return new Blob([JSON.stringify(obj)], { type: "application/json" });
  } else {
    throw new Error(`objectToJsonBlob is not currently supported on Node`);
  }
}
