import { migrateInvalidTimelineStages } from "./migrateInvalidTimelineStages";
import { HUB_INITIATIVE_CURRENT_SCHEMA_VERSION } from "../defaults";
import { IHubInitiative } from "../../core/types/IHubInitiative";
import { migrateInitiativeSlugAndOrgUrlKey } from "./migrateInitiativeSlugAndOrgUrlKey";
import { migrateInitiativeAddDefaultCatalog } from "./migrateInitiativeAddDefaultCatalog";

/**
 * Apply all necessary migrations to the initiative
 * @param initiative
 * @returns
 */
export function applyInitiativeMigrations(
  initiative: IHubInitiative
): IHubInitiative {
  // Ensure the orgUrlKey is lowercase and the slug is updated accordingly
  if (initiative.schemaVersion === HUB_INITIATIVE_CURRENT_SCHEMA_VERSION) {
    return initiative;
  }
  // Apply the migrations
  let migrated = migrateInitiativeAddDefaultCatalog(initiative);
  migrated = migrateInitiativeSlugAndOrgUrlKey(migrated);
  migrated = migrateInvalidTimelineStages(migrated);
  // add more migration here as needed
  // e.g. migrated = anotherMigration(migrated);
  return migrated;
}
