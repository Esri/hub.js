import { IHubPage } from "../../core/types/IHubPage";
import { HUB_PAGE_CURRENT_SCHEMA_VERSION } from "../defaults";
import { migratePageSlugAndOrgUrlKey } from "./migratePageSlugAndOrgUrlKey";

/**
 * Apply project migrations.
 * Exported for testing purposes. This is not exported from the main module.
 * @param page
 * @returns
 */
export function applyPageMigrations(page: IHubPage): IHubPage {
  // Ensure the orgUrlKey is lowercase and the slug is updated accordingly
  if (page.schemaVersion === HUB_PAGE_CURRENT_SCHEMA_VERSION) {
    return page;
  }
  // Apply the migrations
  const migrated = migratePageSlugAndOrgUrlKey(page);
  // add more migration here as needed
  // e.g. migrated = anotherMigration(migrated);
  return migrated;
}
