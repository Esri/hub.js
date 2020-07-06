import { includes } from "./includes";

/**
 * Given an array of strings, add a value and ensure it is unique by incrementing a suffix number
 * @param {Array} entries array of strings
 * @param {string} value string to uniqueify and add
 */
export function ensureUniqueString(entries: string[], value: string): string {
  let foundUnique = false;
  let num = 0;
  let chk = value;
  while (!foundUnique) {
    if (includes(entries, chk)) {
      num++;
      chk = `${value}-${num}`;
    } else {
      foundUnique = true;
    }
  }
  return chk;
}
