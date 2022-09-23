import { capitalize } from "../util";

/**
 * Capitalize every word in a sentence
 * @param {string} value
 * @returns {string} a sentence with every word being capitalized
 */
export function titleize(value: string) {
  return value
    .split(" ")
    .map((k) => capitalize(k))
    .join(" ");
}
