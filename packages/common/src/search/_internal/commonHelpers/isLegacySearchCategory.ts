export type LegacySearchCategory =
  | "Site"
  | "Event"
  | "Dataset"
  | "Document"
  | "App,Map";

/**
 * @private
 * Determines whether a string corresponds to a search category (as opposed to a collection)
 *
 * @param value value to verify
 * @returns whether the value represents one of the old search categories
 */
export function isLegacySearchCategory(value: string) {
  const categories: LegacySearchCategory[] = [
    "Site",
    "Event",
    "Dataset",
    "Document",
    "App,Map",
  ];
  return categories.includes(value as LegacySearchCategory);
}
