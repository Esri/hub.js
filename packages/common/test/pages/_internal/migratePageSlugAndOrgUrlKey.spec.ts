import { describe, it, expect } from "vitest";
import { migratePageSlugAndOrgUrlKey } from "../../../src/pages/_internal/migratePageSlugAndOrgUrlKey";
import { IHubPage } from "../../../src/core/types/IHubPage";

describe("migratePageSlugAndOrgUrlKey", () => {
  it("returns page unchanged if schemaVersion >= 1.1", () => {
    const page = {
      schemaVersion: 1.1,
      slug: "test-slug",
      orgUrlKey: "TestOrg",
      typeKeywords: ["Hub Page"],
    } as IHubPage;
    const result = migratePageSlugAndOrgUrlKey(page);
    expect(result).toBe(page);
  });

  it("migrates slug and orgUrlKey if schemaVersion < 1.1", () => {
    const page = {
      schemaVersion: 1.0,
      slug: "Test-Slug",
      orgUrlKey: "TestOrg",
      typeKeywords: ["Hub Page"],
    } as IHubPage;
    const result = migratePageSlugAndOrgUrlKey(page);
    expect(result).not.toBe(page);
    expect(result.schemaVersion).toBe(1.1);
    expect(result.slug).not.toBe(page.slug);
    expect(result.orgUrlKey).toBe(page.orgUrlKey.toLowerCase());
    expect(Array.isArray(result.typeKeywords)).toBe(true);
  });

  it("handles missing slug, orgUrlKey, and typeKeywords", () => {
    const page = {
      schemaVersion: 1.0,
    } as IHubPage;
    const result = migratePageSlugAndOrgUrlKey(page);
    expect(result.schemaVersion).toBe(1.1);
    expect(typeof result.slug).toBe("string");
    expect(typeof result.orgUrlKey).toBe("string");
    expect(Array.isArray(result.typeKeywords)).toBe(true);
  });

  it("does not mutate the original object", () => {
    const page = {
      schemaVersion: 1.0,
      slug: "original-slug",
      orgUrlKey: "OriginalOrg",
      typeKeywords: ["Hub Page"],
    } as IHubPage;
    const result = migratePageSlugAndOrgUrlKey(page);
    expect(result).not.toBe(page);
    expect(page.schemaVersion).toBe(1.0);
    expect(page.slug).toBe("original-slug");
    expect(page.orgUrlKey).toBe("OriginalOrg");
  });
});
