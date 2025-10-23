import * as sharedMigrations from "../../../src/core/_internal/sharedMigrations";
import { IHubDiscussion } from "../../../src/core/types/IHubDiscussion";
import { migrateDiscussionSlugAndOrgUrlKey } from "../../../src/discussions/_internal/migrateDiscussionSlugAndOrgUrlKey";
import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";

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
  afterEach(() => {
    vi.restoreAllMocks();
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
    const migrateSpy = vi
      .spyOn(sharedMigrations, "migrateSlugAndOrgUrlKey")
      .mockImplementation(
        (..._args: any[]) =>
          ({
            slug: "new-slug",
            orgUrlKey: "new-orgurlkey",
            typeKeywords: ["new-keyword"],
          } as any)
      );
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

  it("handles missing slug and orgUrlKey by passing empty defaults to shared migration", () => {
    const discussionMissing = {
      schemaVersion: 1.0,
      // slug and orgUrlKey intentionally omitted
      typeKeywords: [],
    } as unknown as IHubDiscussion;

    const migrateSpy = vi
      .spyOn(sharedMigrations, "migrateSlugAndOrgUrlKey")
      .mockImplementation(
        (slugArg: string, orgArg: string, typesArg: string[]) => {
          // ensure the function receives the empty defaults we expect
          expect(slugArg).toBe("");
          expect(orgArg).toBe("");
          expect(typesArg).toEqual([]);
          return {
            slug: "generated-slug",
            orgUrlKey: "generated-org",
            typeKeywords: ["slug|generated-org|generated-slug"],
          } as any;
        }
      );

    const migrated = migrateDiscussionSlugAndOrgUrlKey(discussionMissing);

    expect(migrateSpy).toHaveBeenCalled();
    expect(migrated.slug).toBe("generated-slug");
    expect(migrated.orgUrlKey).toBe("generated-org");
    expect(migrated.typeKeywords).toContain(
      "slug|generated-org|generated-slug"
    );
    expect(migrated.schemaVersion).toBe(1.1);
  });
});
