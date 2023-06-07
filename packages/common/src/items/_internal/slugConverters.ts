// TODO: work out how to unify content slug fns
// https: github.com/Esri/hub.js/blob/master/packages/common/src/content/index.ts#L301-L348
/**
 * Uri slugs have `::` as a separator, but we need to use `|` in the typeKeywords. This function
 * converts a uri slug to a typeKeyword slug.
 * @param slug
 * @returns
 */

export function uriSlugToKeywordSlug(slug: string): string {
  if (slug.indexOf("::") > -1) {
    slug = slug.replace("::", "|");
  }
  return slug;
}
/**
 * Convert a typeKeyword slug to a uri slug. This is the reverse of uriSlugToKeywordSlug
 * @param slug
 * @returns
 */

export function keywordSlugToUriSlug(slug: string): string {
  if (slug.indexOf("|") > -1) {
    slug = slug.replace("|", "::");
  }
  return slug;
}
