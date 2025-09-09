import { HUB_DISCUSSION_CURRENT_SCHEMA_VERSION } from "../../../src/discussions/defaults";
import * as migrateDiscussionSlugAndOrgUrlKeyModule from "../../../src/discussions/_internal/migrateDiscussionSlugAndOrgUrlKey";
import { IHubDiscussion } from "../../../src/core/types/IHubDiscussion";
import { applyDiscussionMigrations } from "../../../src/discussions/_internal/applyDiscussionMigrations";

describe("applyDiscussionMigrations", () => {
  let discussion: IHubDiscussion;

  beforeEach(() => {
    discussion = {
      schemaVersion: 1.0,
      slug: "Test-Slug",
      orgUrlKey: "ORGKEY",
      typeKeywords: ["keyword1"],
      // other required properties...
    } as IHubDiscussion;
  });

  describe("applyDiscussionMigrations", () => {
    it("returns discussion unchanged if schemaVersion is current", () => {
      const currentDiscussion = {
        ...discussion,
        schemaVersion: HUB_DISCUSSION_CURRENT_SCHEMA_VERSION,
      };
      const result = applyDiscussionMigrations(currentDiscussion);
      expect(result).toBe(currentDiscussion);
    });

    it("calls migrateDiscussionSlugAndOrgUrlKey if schemaVersion is outdated", () => {
      const spy = spyOn(
        migrateDiscussionSlugAndOrgUrlKeyModule,
        "migrateDiscussionSlugAndOrgUrlKey"
      ).and.callThrough();
      applyDiscussionMigrations(discussion);
      expect(spy).toHaveBeenCalledWith(discussion);
    });
    it("handles undefined typeKeywords", () => {
      const discussionWithUndefinedTypeKeywords = {
        ...discussion,
      };
      delete discussionWithUndefinedTypeKeywords.typeKeywords;
      const result = applyDiscussionMigrations(
        discussionWithUndefinedTypeKeywords
      );
      expect(result.typeKeywords).toEqual(["slug|orgkey|test-slug"]);
    });
  });
});
