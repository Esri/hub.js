import { Blob } from "./_which-blob/";

/**
 * Given a string, return it as a blob
 * @param {string} the string
 */
export function stringToBlob(s: string): Blob {
  const bytes = [];
  for (let i = 0; i < s.length; i++) {
    bytes[i] = s.charCodeAt(i);
  }
  const encoded = new Uint8Array(bytes);
  return new Blob([encoded], { type: "application/octet-stream" });
}
