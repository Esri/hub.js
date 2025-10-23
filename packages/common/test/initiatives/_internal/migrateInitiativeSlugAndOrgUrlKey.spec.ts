import {
  describe,
  it,
  expect,
} from "vitest";

import { migrateInitiativeSlugAndOrgUrlKey } from "../../../src/initiatives/_internal/migrateInitiativeSlugAndOrgUrlKey";
import { IHubInitiative } from "../../../src/core/types/IHubInitiative";

describe("migrateInitiativeSlugAndOrgUrlKey", () => {
  it("returns initiative unchanged if schemaVersion >= 2.1", () => {
    const initiative: IHubInitiative = {
      schemaVersion: 2.1,
      slug: "test-slug",
      orgUrlKey: "testorg",
      typeKeywords: ["initiative", "slug|testorg|test-slug"],
    } as any;
    const result = migrateInitiativeSlugAndOrgUrlKey(initiative);
    expect(result).toBe(initiative);
  });

  it("migrates slug and orgUrlKey if schemaVersion < 1.1", () => {
    const initiative: IHubInitiative = {
      schemaVersion: 1.0,
      slug: "TestSlug",
      orgUrlKey: "TestOrg",
      typeKeywords: ["initiative"],
    } as any;
    const result = migrateInitiativeSlugAndOrgUrlKey(initiative);
    expect(result).not.toBe(initiative);
    expect(result.slug).toBe("testorg|testslug");
    expect(result.orgUrlKey).toBe("testorg");
    expect(result.typeKeywords).toContain("slug|testorg|testslug");
    expect(result.schemaVersion).toBe(2.1);
  });

  it("handles missing slug, orgUrlKey, and typeKeywords", () => {
    const initiative: IHubInitiative = {
      schemaVersion: 1.0,
    } as any;
    const result = migrateInitiativeSlugAndOrgUrlKey(initiative);
    expect(result.slug).toBe("");
    expect(result.orgUrlKey).toBe("");
    expect(result.typeKeywords).toEqual([]);
    expect(result.schemaVersion).toBe(2.1);
  });

  it("does not mutate the original initiative object", () => {
    const initiative: IHubInitiative = {
      schemaVersion: 1.0,
      slug: "TestSlug",
      orgUrlKey: "TestOrg",
      typeKeywords: ["initiative"],
    } as any;
    const original = { ...initiative };
    migrateInitiativeSlugAndOrgUrlKey(initiative);
    expect(initiative).toEqual(original);
  });
});
