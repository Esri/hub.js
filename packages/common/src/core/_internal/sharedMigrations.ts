/**
 * Ensures that the orgUrlKey and slug fields of the entity are lowercase.
 * Used in migrations to address a bug with orgs with mixed case orgUrlKeys.
 * @param entity
 * @returns
 */
export function migrateSlugAndOrgUrlKey(
  slug: string,
  orgUrlKey: string,
  typeKeywords: string[]
): { slug: string; orgUrlKey: string; typeKeywords: string[] } {
  // let slug = getWithDefault(entity, "slug", "") as string;
  // // In Enterprise, orgUrlKey is not a thing so we use an empty string
  // const orgUrlKey = getWithDefault(entity, "orgUrlKey", "") as string;
  // Ensure orgUrlKey is set and downcased
  const resp = { slug: "", orgUrlKey: "", typeKeywords: [] as string[] };
  resp.orgUrlKey = orgUrlKey.toLowerCase();
  // If we have a slug...
  if (slug) {
    // if we have orgUrlKey...
    if (orgUrlKey) {
      // remove any orgUrlKey prefixes from the slug
      // e.g. esso1|esso1|esso1|my-site -> my-site
      slug = slug.replace(
        new RegExp(`${orgUrlKey.toLowerCase()}\\|`, "gi"),
        ""
      );
      // and prefix the slug with the orgUrlKey
      // e.g. my-site -> esso1|my-site
      // and ensure it is lowercase
      // e.g. ESSIso1|my-site -> essiso1|my-site
      slug = `${orgUrlKey}|${slug}`;
    }
    // just ensure the slug is downcased
    // e.g. My-Site -> my-site
    resp.slug = slug.toLowerCase();
  }

  // remove any existing slug| keywords
  resp.typeKeywords = typeKeywords.filter(
    (tk: string) => !tk.startsWith("slug|")
  );
  // add the new slug keyword if the slug is not empty
  if (resp.slug) {
    resp.typeKeywords.push(`slug|${resp.slug}`);
  }

  return resp;
}
