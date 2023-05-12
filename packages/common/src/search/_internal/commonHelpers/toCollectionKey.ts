import { WellKnownCollection } from "../../wellKnownCatalog";
import { LegacySearchCategory } from "./isLegacySearchCategory";

/**
 * @private
 * Converts a search category key to its corresponding wellknown collection key
 *
 * @param legacySearchCategory search category key to transform
 * @returns the wellknown collection key
 */
export function toCollectionKey(
  legacySearchCategory: LegacySearchCategory
): WellKnownCollection {
  return legacySearchCategory === "App,Map"
    ? "appAndMap"
    : (legacySearchCategory.toLowerCase() as WellKnownCollection);
}
