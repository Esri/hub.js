import { parseIdentifier } from "../../../src/items/_internal/slugs";

describe("item _internal slug", () => {
  const guidId = "67be0486253a423891042361843d1b0a";
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
