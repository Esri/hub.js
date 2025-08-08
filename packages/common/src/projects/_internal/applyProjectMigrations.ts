import { migrateInvalidTimelineStages } from "./migrateInvalidTimelineStages";
import { IHubProject } from "../../core/types/IHubProject";
import { HUB_PROJECT_CURRENT_SCHEMA_VERSION } from "../defaults";
import { migrateProjectSlugAndOrgUrlKey } from "./migrateProjectSlugAndOrgUrlKey";

/**
 * Apply project migrations.
 * Exported for testing purposes. This is not exported from the main module.
 * @param project
 * @returns
 */
export function applyProjectMigrations(project: IHubProject): IHubProject {
  // Ensure the orgUrlKey is lowercase and the slug is updated accordingly
  if (project.schemaVersion === HUB_PROJECT_CURRENT_SCHEMA_VERSION) {
    return project;
  }
  // Apply the migrations
  let migrated = migrateProjectSlugAndOrgUrlKey(project);
  migrated = migrateInvalidTimelineStages(migrated);
  // add more migration here as needed
  // e.g. migrated = anotherMigration(migrated);
  return migrated;
}
