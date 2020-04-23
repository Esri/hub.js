/**
 * Perform the following operations on a string to make it slug-friendly:
 * 1. trim it
 * 2. convert to lowercase
 * 3. remove any character not a-z, 0-9, or _
 * 4. dasherize it
 * @param {String} value String to slugify
 */
export function slugify<T>(value: T): T {
  if (typeof value === "string") {
    // @ts-ignore
    return value
      .trim()
      .toLowerCase()
      .replace(/ +/g, "-")
      .replace(/[^\w-]/g, "")
      .replace(/-+/g, "-");
  } else {
    return value;
  }
}
