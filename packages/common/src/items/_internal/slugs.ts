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
export function truncateSlug(slug: string, orgKey: string, paddingEnd = 0) {
  // typekeywords have a max length of 256 characters, so we use the slug
  // format that gets persisted in typekeywords as our basis
  return (
    [
      // add the typekeyword slug prefix
      TYPEKEYWORD_SLUG_PREFIX,
      // add the orgKey segment
      orgKey.toLowerCase(),
      // add the slugified title segment
      slug,
    ]
      .join("|")
      .substring(0, TYPEKEYWORD_MAX_LENGTH - paddingEnd)
      // removing tailing hyphens
      .replace(/-+$/, "")
      // remove typekeyword slug prefix, it's re-added in setSlugKeyword
      .replace(new RegExp(`^${TYPEKEYWORD_SLUG_PREFIX}\\|`), "")
  );
}

/**
 * get the max length of a slug, accounting for the type keyword prefix and orgKey
 * @param orgKey
 * @returns
 */
export function getSlugMaxLength(orgKey: string) {
  const prefix = `${TYPEKEYWORD_SLUG_PREFIX}|${orgKey}|`;
  return TYPEKEYWORD_MAX_LENGTH - prefix.length;
}
