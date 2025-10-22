import { isGuid } from "../../utils/is-guid";
import {
  SLUG_ORG_SEPARATOR_KEYWORD,
  SLUG_ORG_SEPARATOR_URI,
} from "./slugConverters";

const SLUG_ID_SEPARATOR = "~";

const TYPEKEYWORD_MAX_LENGTH = 256;

export const TYPEKEYWORD_SLUG_PREFIX = "slug";

/**
 * truncate a slug, namespaced to an org and accounting for the 256 character limit
 * of individual typekeywords.
 *
 * @param title
 * @param orgKey
 * @returns
 */
export function truncateSlug(
  slug: string,
  orgKey = "",
  paddingEnd = 0
): string {
  // typekeywords have a max length of 256 characters, so we use the slug
  // format that gets persisted in typekeywords as our basis
  // Although it's removed later, we start with the typekeyword slug prefix
  // to do the length check.
  const parts = [TYPEKEYWORD_SLUG_PREFIX];
  // if orgKey is provided, add it as a segment and ensure it is lowercased
  if (orgKey) {
    parts.push(orgKey.toLowerCase());
  }
  // add the slug
  parts.push(slug);
  return (
    parts
      .join("|")
      .substring(0, TYPEKEYWORD_MAX_LENGTH - paddingEnd)
      // removing tailing hyphens
      .replace(/-+$/, "")
      // remove slug prefix, it's re-added in setSlugKeyword
      .replace(new RegExp(`^${TYPEKEYWORD_SLUG_PREFIX}\\|`), "")
  );
}

/**
 * get the max length of a slug, accounting for the type keyword prefix and orgKey
 * @param orgKey
 * @returns
 */
export function getSlugMaxLength(orgKey: string): number {
  const prefix = `${TYPEKEYWORD_SLUG_PREFIX}|${orgKey}|`;
  return TYPEKEYWORD_MAX_LENGTH - prefix.length;
}

export interface IParsedIdentifier {
  /* ArcGIS Online item Id */
  id?: string;
  /* slug (without org prefix) */
  slug?: string;
  /* org key */
  orgKey?: string;
}

/**
 * parse out the item's id, slug, and org key out of an identifier
 * @param identifier
 * @returns
 */
export const parseIdentifier = (identifier: string): IParsedIdentifier => {
  let orgKey;
  let slug;
  // if identifier is a guid, we just return that as the id below
  let id = isGuid(identifier) && identifier;
  if (!id) {
    // otherwise try parsing id, slug, and org key from the identifier
    let slugParts;
    [slugParts, id] = identifier.split(SLUG_ID_SEPARATOR);
    const match = new RegExp(`^((.*)${SLUG_ORG_SEPARATOR_URI})?(.*)$`).exec(
      slugParts
    );
    // istanbul ignore next - I think that regex will always match at least the slug -- @preserve
    if (match) {
      orgKey = match[2];
      slug = match[3];
    }
  }
  return {
    id,
    slug,
    orgKey,
  };
};

/**
 * strip org key prefix from a slug and append an id
 * @param slug
 * @param id
 * @returns
 */
export const appendIdToSlug = (slug: string, id: string): string => {
  const slugWithoutOrgKey = slug.split(SLUG_ORG_SEPARATOR_KEYWORD).pop();
  return `${slugWithoutOrgKey}${SLUG_ID_SEPARATOR}${id}`;
};
