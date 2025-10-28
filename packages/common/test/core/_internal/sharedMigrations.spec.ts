import {
  describe,
  it,
  expect,
} from "vitest";
import { migrateSlugAndOrgUrlKey } from "../../../src/core/_internal/sharedMigrations";
describe("migrateSlugAndOrgUrlKey:", () => {
  it("should lowercase orgUrlKey and slug, and add correct slug keyword", () => {
    const result = migrateSlugAndOrgUrlKey("My-Site", "Esso1", [
      "foo",
      "slug|old",
    ]);
    expect(result.slug).toBe("esso1|my-site");
    expect(result.orgUrlKey).toBe("esso1");
    expect(result.typeKeywords).toEqual(["foo", "slug|esso1|my-site"]);
  });

  it("should remove orgUrlKey prefixes from slug", () => {
    const result = migrateSlugAndOrgUrlKey("Esso1|Esso1|my-site", "Esso1", [
      "slug|esso1|esso1|my-site",
    ]);
    expect(result.slug).toBe("esso1|my-site");
    expect(result.typeKeywords).toEqual(["slug|esso1|my-site"]);
  });

  it("should handle empty slug", () => {
    const result = migrateSlugAndOrgUrlKey("", "Esso1", ["foo", "slug|old"]);
    expect(result.slug).toBe("");
    expect(result.orgUrlKey).toBe("esso1");
    expect(result.typeKeywords).toEqual(["foo"]);
  });

  it("should handle empty orgUrlKey", () => {
    const result = migrateSlugAndOrgUrlKey("My-Site", "", ["foo", "slug|old"]);
    expect(result.slug).toBe("my-site");
    expect(result.orgUrlKey).toBe("");
    expect(result.typeKeywords).toEqual(["foo", "slug|my-site"]);
  });

  it("should not add slug keyword if slug is empty", () => {
    const result = migrateSlugAndOrgUrlKey("", "", ["slug|old"]);
    expect(result.typeKeywords).toEqual([]);
  });

  it("should remove all slug| keywords from typeKeywords", () => {
    const result = migrateSlugAndOrgUrlKey("site", "org", [
      "slug|foo",
      "slug|bar",
      "baz",
    ]);
    expect(result.typeKeywords).toEqual(["baz", "slug|org|site"]);
  });

  it("should handle mixed case slug and orgUrlKey", () => {
    const result = migrateSlugAndOrgUrlKey("My-Site", "OrgKey", ["slug|old"]);
    expect(result.slug).toBe("orgkey|my-site");
    expect(result.orgUrlKey).toBe("orgkey");
    expect(result.typeKeywords).toEqual(["slug|orgkey|my-site"]);
  });
});
