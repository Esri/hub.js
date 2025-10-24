import {
  describe,
  it,
  expect,
} from "vitest";
import {
  parseIdentifier,
  truncateSlug,
} from "../../../src/items/_internal/slugs";

describe("item _internal slug", () => {
  const guidId = "67be0486253a423891042361843d1b0a";

  describe("truncateSlug:", () => {
    it("truncates a slug to 251 characters", () => {
      const longSlug = "a".repeat(300);

      expect(truncateSlug(longSlug).length).toEqual(251);
    });

    it("does not truncate a slug that is less than 251 characters", () => {
      expect(truncateSlug("hello-world")).toEqual("hello-world");
    });

    it("returns an empty string when given an empty string", () => {
      expect(truncateSlug("")).toEqual("");
    });
    it("handles orgKey passed as undefined", () => {
      const result = truncateSlug("hello-world", undefined);
      expect(result).toEqual("hello-world");
    });
  });

  describe("parseIdentifier", () => {
    it("only returns an id when identifier is a guid", () => {
      const identifier = guidId;
      expect(parseIdentifier(identifier)).toEqual({
        id: guidId,
        orgKey: undefined,
        slug: undefined,
      });
    });
    it("parses an identifier with an id and an org key", () => {
      const identifier = `some-org::some-slug~${guidId}`;
      expect(parseIdentifier(identifier)).toEqual({
        id: guidId,
        orgKey: "some-org",
        slug: "some-slug",
      });
    });
    it("parses an identifier with no id", () => {
      const identifier = "some-org::some-slug";
      expect(parseIdentifier(identifier)).toEqual({
        id: undefined,
        orgKey: "some-org",
        slug: "some-slug",
      });
    });
    it("parses an identifier with no id and no org key", () => {
      const identifier = "some-slug";
      expect(parseIdentifier(identifier)).toEqual({
        id: undefined,
        orgKey: undefined,
        slug: "some-slug",
      });
    });
    it("handles an empty string", () => {
      const identifier = "";
      expect(parseIdentifier(identifier)).toEqual({
        id: undefined,
        orgKey: undefined,
        slug: "",
      });
    });
  });
});
