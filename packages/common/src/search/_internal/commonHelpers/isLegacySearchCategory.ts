export type LegacySearchCategory =
  | "Site"
  | "Event"
  | "Dataset"
  | "Document"
  | "App,Map";

export function isLegacySearchCategory(value: any) {
  const categories: LegacySearchCategory[] = [
    "Site",
    "Event",
    "Dataset",
    "Document",
    "App,Map",
  ];
  return categories.includes(value);
}
