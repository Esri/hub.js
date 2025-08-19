import { migrateSlugAndOrgUrlKey } from "../../core/_internal/sharedMigrations";
import { IHubInitiative } from "../../core/types/IHubInitiative";
import { cloneObject } from "../../util";

/**
 * Ensures the orgUrlKey is lowercase and the slug is updated accordingly.
 * Exported just for testing purposes. This is not exported from the main module.
 * @param project
 * @returns
 */
export function migrateInitiativeSlugAndOrgUrlKey(
  initiative: IHubInitiative
): IHubInitiative {
  if (initiative.schemaVersion >= 2.1) {
    return initiative;
  }
  const clone = cloneObject(initiative);
  const { slug, orgUrlKey, typeKeywords } = migrateSlugAndOrgUrlKey(
    clone.slug || "",
    clone.orgUrlKey || "",
    clone.typeKeywords || []
  );
  clone.slug = slug;
  clone.orgUrlKey = orgUrlKey;
  clone.typeKeywords = typeKeywords;

  clone.schemaVersion = 2.1;
  return clone;
}
