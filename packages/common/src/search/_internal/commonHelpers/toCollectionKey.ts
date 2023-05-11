import { LegacySearchCategory } from "./isLegacySearchCategory";

export function toCollectionKey(legacySearchCategory: LegacySearchCategory) {
  return legacySearchCategory === "App,Map"
    ? "appAndMap"
    : legacySearchCategory.toLowerCase();
}
