import { IItem } from "@esri/arcgis-rest-portal";
import { keywordSlugToUriSlug } from "./_internal/slugConverters";
import { appendIdToSlug } from "./slugs";

/**
 * Consistent means to get an item's identifier - either the slug or the id
 * @param item
 * @returns
 */
export function getItemIdentifier(
  item: IItem,
  includeIdInSlug = false
): string {
  const { id, properties } = item;
  const slug = properties?.slug;
  return slug
    ? keywordSlugToUriSlug(includeIdInSlug ? appendIdToSlug(slug, id) : slug)
    : id;
}
