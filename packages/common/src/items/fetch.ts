import { IRequestOptions } from "@esri/arcgis-rest-request";
import { IItem, getItem } from "@esri/arcgis-rest-portal";
import { addContextToSlug } from "../content";
import { findItemsBySlug } from "./slugs";
import { uriSlugToKeywordSlug } from "./_internal/slugConverters";
import { parseIdentifier } from "./_internal/slugs";

/**
 * Fetch an item by its identifier
 * @param identifier item id or slug, which may or may not include the org key
 * @param requestOptions
 */
export function fetchItem(
  identifier: string,
  requestOptions: IRequestOptions
): Promise<IItem> {
  const { id, slug, orgKey } = parseIdentifier(identifier);
  if (id) {
    // use the id to fetch the item
    return getItem(id, requestOptions);
  }
  // we'll have to look up by slug
  // first, ensure the slug has the org key
  // TODO: fallback to site org key if none parsed from slug
  const fullyQualifiedSlug = addContextToSlug(slug, orgKey);
  const slugKeyword = uriSlugToKeywordSlug(fullyQualifiedSlug);
  return findItemsBySlug({ slug: slugKeyword }, requestOptions).then(
    (results) => {
      if (results.length) {
        // search results only include a subset of properties of the item, so
        // issue a subsequent call to getItem to get the full item details
        return getItem(results[0].id, requestOptions);
      } else {
        return null;
      }
    }
  );
}
