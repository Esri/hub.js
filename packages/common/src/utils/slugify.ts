/**
 * Converts a string to a slug-friendly format by:
 * 1. Trimming leading and trailing spaces
 * 2. Converting to lowercase
 * 3. Removing single and double quotes
 * 4. Replacing any character not a-z, 0-9, or hyphen with a hyphen
 * 5. Collapsing multiple hyphens into one
 * 6. Removing leading and trailing hyphens
 * @param value String to slugify
 * @returns Slugified string, or original value if not a string
 */
export function slugify<T>(value: T): T {
  if (typeof value === "string") {
    const sanitized = value
      .trim() // remove leading/trailing spaces
      .toLowerCase() // convert to lowercase
      .replace(/['"]/g, "") // remove single and double quotes
      .replace(/[^a-z0-9-]+/g, "-") // replace anything not a-z, 0-9, or hyphen with a hyphen
      .replace(/-+/g, "-") // collapse multiple hyphens into one
      .replace(/^-+|-+$/g, ""); // remove leading/trailing hyphens

    // If the title input cannot produce a valid slug, we return an empty string
    // because we can't return something incomplete/invalid
    if (sanitized === "" || sanitized === "-") {
      return "" as unknown as T;
    }
    return sanitized as unknown as T;
  } else {
    return value;
  }
}
