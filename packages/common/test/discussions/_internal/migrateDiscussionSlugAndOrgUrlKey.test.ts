import * as sharedMigrations from "../../../src/core/_internal/sharedMigrations";
import { IHubDiscussion } from "../../../src/core/types/IHubDiscussion";
import { migrateDiscussionSlugAndOrgUrlKey } from "../../../src/discussions/_internal/migrateDiscussionSlugAndOrgUrlKey";

describe("migrateDiscussionSlugAndOrgUrlKey", () => {
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
  it("returns discussion unchanged if schemaVersion >= 1.1", () => {
    const migrated = migrateDiscussionSlugAndOrgUrlKey({
      ...discussion,
      schemaVersion: 1.1,
    });
    expect(migrated.schemaVersion).toBe(1.1);
    expect(migrated.slug).toBe(discussion.slug);
    expect(migrated.orgUrlKey).toBe(discussion.orgUrlKey);
  });
  it("returns discussion with updated slug and orgUrlKey if schemaVersion < 1.1", () => {
    const migrated = migrateDiscussionSlugAndOrgUrlKey(discussion);
    expect(migrated.schemaVersion).toBe(1.1);
    expect(migrated.slug).toBe("orgkey|test-slug");
    expect(migrated.orgUrlKey).toBe("orgkey");
    expect(migrated.typeKeywords).toContain("slug|orgkey|test-slug");
  });
  it("migrates slug and orgUrlKey and sets schemaVersion to 1.1", () => {
    const migrateSpy = spyOn(
      sharedMigrations,
      "migrateSlugAndOrgUrlKey"
    ).and.callFake((..._args: string[]) => ({
      slug: "new-slug",
      orgUrlKey: "new-orgurlkey",
      typeKeywords: ["new-keyword"],
    }));
    const migrated = migrateDiscussionSlugAndOrgUrlKey(discussion);
    expect(migrateSpy).toHaveBeenCalledWith(
      discussion.slug,
      discussion.orgUrlKey,
      discussion.typeKeywords
    );
    expect(migrated.slug).toBe("new-slug");
    expect(migrated.orgUrlKey).toBe("new-orgurlkey");
    expect(migrated.typeKeywords).toEqual(["new-keyword"]);
    expect(migrated.schemaVersion).toBe(1.1);
  });
});
