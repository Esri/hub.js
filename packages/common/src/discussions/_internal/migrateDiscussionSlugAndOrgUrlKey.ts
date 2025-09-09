import { migrateSlugAndOrgUrlKey } from "../../core/_internal/sharedMigrations";
import { IHubDiscussion } from "../../core/types/IHubDiscussion";
import { cloneObject } from "../../util";

/**
 * Ensures the orgUrlKey is lowercase and the slug is updated accordingly.
 * Exported just for testing purposes. This is not exported from the main module.
 * @param discussion
 * @returns
 */
export function migrateDiscussionSlugAndOrgUrlKey(
  discussion: IHubDiscussion
): IHubDiscussion {
  if (discussion.schemaVersion >= 1.1) {
    return discussion;
  }
  const clone = cloneObject(discussion);
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
