import { atob, btoa } from "abab";

// these were copied from:
// https://developer.mozilla.org/en-US/docs/Glossary/Base64#the_unicode_problem
function base64ToBytes(base64: string) {
  const binString = atob(base64);
  return Uint8Array.from(binString, (m) => m.codePointAt(0));
}
function bytesToBase64(bytes: Uint8Array) {
  const binString = Array.from(bytes, (x) => String.fromCodePoint(x)).join("");
  return btoa(binString);
}

/**
 * Base 64 encoding for strings that may include unicode characters
 * @param data
 * @returns base
 */
export function unicodeToBase64(data: string) {
  return bytesToBase64(new TextEncoder().encode(data));
}

/**
 * Base 64 decoding for strings that may include unicode characters
 * @param data
 * @returns
 */
export function base64ToUnicode(data: string) {
  return new TextDecoder().decode(base64ToBytes(data));
}
