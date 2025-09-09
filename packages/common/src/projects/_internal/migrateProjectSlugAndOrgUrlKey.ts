import { IHubProject } from "../../core";
import { migrateSlugAndOrgUrlKey } from "../../core/_internal/sharedMigrations";
import { cloneObject } from "../../util";

/**
 * Ensures the orgUrlKey is lowercase and the slug is updated accordingly.
 * Exported just for testing purposes. This is not exported from the main module.
 * @param project
 * @returns
 */
export function migrateProjectSlugAndOrgUrlKey(
  project: IHubProject
): IHubProject {
  if (project.schemaVersion >= 1.1) {
    return project;
  }
  const clone = cloneObject(project);
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
