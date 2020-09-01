import { isGuid } from "@esri/hub-common";
import { parseDatasetId } from "./hub";

/**
 * Determine if an identifier is a Hub API slug
 *
 * @param identifier Hub API slug ({orgKey}::{title-as-slug} or {title-as-slug})
 * or record id ((itemId}_{layerId} or {itemId})
 * @returns true if the identifier is valid _and_ is **not** a record id
 */
export function isSlug(identifier: string): boolean {
  const { itemId } = parseDatasetId(identifier);
  if (!itemId || isGuid(itemId)) {
    // it's either invalid, or an item id, or a dataset id
    return false;
  }
  // otherwise assume it's a slug
  return true;
}
