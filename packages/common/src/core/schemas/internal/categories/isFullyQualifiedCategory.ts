/**
 * Detects whether a given string is a fully qualified category.
 * A fully qualified category is one that starts with either "/Categories/" or "/categories/".
 *
 * @param value The string to check.
 * @returns true if the string is a fully qualified category, false otherwise.
 */
export function isFullyQualifiedCategory(value: string): boolean {
  return isOrganizationCategory(value) || isAggregationCategory(value);
}

/**
 * Detects whether a given string comes from an organization's category schema.
 * Since the category schema preserves casing, this function checks for the prefix "/Categories".
 *
 * @param value The string to check.
 * @returns true if the string is an organization category, false otherwise.
 */
export function isOrganizationCategory(value: string): boolean {
  return value.startsWith("/Categories");
}

/**
 * Detects whether a given string comes from a search aggregation.
 * Since search aggregation categories are all lowercase, this function checks for the prefix "/categories".
 *
 * @param value The string to check.
 * @returns true if the string is an aggregation category, false otherwise.
 */
export function isAggregationCategory(value: string): boolean {
  return value.startsWith("/categories");
}
