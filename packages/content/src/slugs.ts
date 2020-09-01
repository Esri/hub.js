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

/**
 * Add a context (prefix) to slug if it doesn't already have one
 *
 * @param slug Hub API slug (with or without context)
 * @param context usually a portal's orgKey
 * @returns slug with context ({context}::{slug})
 */
export function addContextToSlug(slug: string, context: string): string {
  // the slug has an org key already e.g. dc::crime-incidents
  if (/.+::.+/.test(slug)) {
    return slug;
    // the slug belongs to the org that owns the site e.g. crime-incidents
  } else {
    return `${context}::${slug}`;
  }
}

/**
 * Remove context (prefix) from a slug
 *
 * @param slug Hub API slug with context
 * @param context usually a portal's orgKey
 * @returns slug without context
 */
export function removeContextFromSlug(slug: string, context: string): string {
  if (context && slug.match(`${context}::`)) {
    return slug.split(`${context}::`)[1];
  } else {
    return slug;
  }
}
