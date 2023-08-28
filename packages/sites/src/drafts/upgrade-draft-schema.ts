import { deepSet, getProp, IDraft } from "@esri/hub-common";
import {
  SITE_SCHEMA_VERSION,
  _ensureTelemetry,
  _migrateFeedConfig,
  _migrateEventListCardConfigs,
} from "@esri/hub-common";

const schemaVersionPath = "item.properties.schemaVersion";
const initialDraftVersion = 1.3;

/**
 * Applies the schema upgrades
 * @param draft IDraft
 */
export function upgradeDraftSchema(draft: IDraft) {
  if (getProp(draft, "item.properties.schemaVersion") === undefined) {
    deepSet(draft, schemaVersionPath, initialDraftVersion);
  }

  if (getProp(draft, "item.properties.schemaVersion") === SITE_SCHEMA_VERSION) {
    return draft;
  } else {
    let migrated = draft;
    // apply site schema upgrade functions in order...
    // don't have do do them all since drafts only got released
    // at version 1.3
    migrated = _ensureTelemetry<IDraft>(draft);
    migrated = _migrateFeedConfig<IDraft>(draft);
    migrated = _migrateEventListCardConfigs<IDraft>(draft);
    return migrated;
  }
}
