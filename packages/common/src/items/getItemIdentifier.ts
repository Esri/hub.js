import { IItem } from "@esri/arcgis-rest-portal";
import { keywordSlugToUriSlug } from "./_internal/slugConverters";
import { appendIdToSlug } from "./_internal/slugs";

/**
 * Consistent means to get an item's identifier - either the slug or the id
 * @param item
 * @returns
 */
export function getItemIdentifier(
  item: IItem,
  // for backwards compatibility, we do not include the id in the slug by default
  // once all of the routes have been updated to expect slugs w/ ids, we should always include the id
  includeIdInSlug = false
): string {
  const { id, properties } = item;
  const slug = properties?.slug;
  return slug
    ? keywordSlugToUriSlug(includeIdInSlug ? appendIdToSlug(slug, id) : slug)
    : id;
}
