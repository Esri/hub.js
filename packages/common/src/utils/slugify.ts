/**
 * Perform the following operations on a string to make it slug-friendly:
 * 1. trim it
 * 2. convert to lowercase
 * 3. remove any character not a-z or 0-9
 * 4. dasherize it
 * 5. remove leading and trailing dashes
 * @param {String} value String to slugify
 */
export function slugify<T>(value: T): T {
  if (typeof value === "string") {
    // @ts-ignore
    return value
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-") // replace runs of anything NOT a-z or 0-9 with "-"
      .replace(/-+/g, "-") // collapse multiple "-" into one
      .replace(/^-+|-+$/g, ""); // trim leading/trailing "-"
  } else {
    return value;
  }
}
