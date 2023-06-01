import { IItem } from "@esri/arcgis-rest-portal";
import { keywordSlugToUriSlug } from "./_internal/slugConverters";

/**
 * Consistent means to get an item's identifier - either the slug or the id
 * @param item
 * @returns
 */
export function getItemIdentifier(item: IItem): string {
  const slug = item.properties?.slug;
  return slug ? keywordSlugToUriSlug(slug) : item.id;
}
