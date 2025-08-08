import { migrateSlugAndOrgUrlKey } from "../../core/_internal/sharedMigrations";
import { IHubPage } from "../../core/types/IHubPage";
import { cloneObject } from "../../util";

/**
 * Ensures the orgUrlKey is lowercase and the slug is updated accordingly.
 * Exported just for testing purposes. This is not exported from the main module.
 * @param project
 * @returns
 */
export function migratePageSlugAndOrgUrlKey(page: IHubPage): IHubPage {
  if (page.schemaVersion >= 1.1) {
    return page;
  }
  const clone = cloneObject(page);
  const { slug, orgUrlKey, typeKeywords } = migrateSlugAndOrgUrlKey(
    clone.slug || "",
    clone.orgUrlKey || "",
    clone.typeKeywords || []
  );
  clone.slug = slug;
  clone.orgUrlKey = orgUrlKey;
  clone.typeKeywords = typeKeywords;

  clone.schemaVersion = 1.1;
  return clone;
}
