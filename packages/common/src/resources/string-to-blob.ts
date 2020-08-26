/**
 * Given a string, return it as a blob
 * NOTE: USE objectToJsonBlob if you're saving a JSON resource!!!
 * NOTE: This is not currently supported in Node
 * @param {string} the string
 */
export function stringToBlob(
  s: string,
  options: BlobPropertyBag = { type: "application/octet-stream" }
) {
  /* istanbul ignore next */
  if (typeof Blob !== "undefined") {
    const bytes = [];
    for (let i = 0; i < s.length; i++) {
      bytes[i] = s.charCodeAt(i);
    }
    const encoded = new Uint8Array(bytes);
    return new Blob([encoded], options);
  } else {
    throw new Error(`stringToBlob is not currently supported on Node`);
  }
}
