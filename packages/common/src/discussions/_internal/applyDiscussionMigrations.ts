import { IHubDiscussion } from "../../core/types/IHubDiscussion";
import { HUB_DISCUSSION_CURRENT_SCHEMA_VERSION } from "../defaults";
import { migrateDiscussionSlugAndOrgUrlKey } from "./migrateDiscussionSlugAndOrgUrlKey";

/**
 * Apply discussion migrations.
 * Exported for testing purposes. This is not exported from the main module.
 * @param discussion
 * @returns
 */
export function applyDiscussionMigrations(
  discussion: IHubDiscussion
): IHubDiscussion {
  // Ensure the orgUrlKey is lowercase and the slug is updated accordingly
  if (discussion.schemaVersion === HUB_DISCUSSION_CURRENT_SCHEMA_VERSION) {
    return discussion;
  }
  // Apply the migrations
  const migrated = migrateDiscussionSlugAndOrgUrlKey(discussion);
  // add more migration here as needed
  // e.g. migrated = anotherMigration(migrated);
  return migrated;
}
