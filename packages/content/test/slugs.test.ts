import { isSlug, addContextToSlug } from "../src/slugs";

describe("slugs", () => {
  describe("isSlug", function() {
    it("returns false when identifier is undefined", () => {
      const result = isSlug(undefined);
      expect(result).toBe(false);
    });
    it("returns false when identifier is an item id", () => {
      const result = isSlug("7a153563b0c74f7eb2b3eae8a66f2fbb");
      expect(result).toBe(false);
    });
    it("returns true when identifier is a slug w/o orgKey", () => {
      const result = isSlug("foo-bar");
      expect(result).toBe(true);
    });
    it("returns true when identifier is a slug w/ orgKey", () => {
      const result = isSlug("org-key::foo-bar");
      expect(result).toBe(true);
    });
  });
  describe("addContextToSlug", () => {
    const title = "foo-bar";
    const orgKey = "org-key";
    const slugWithContext = `${orgKey}::${title}`;
    it("appends the context to slug without context", () => {
      const slug = addContextToSlug(title, orgKey);
      expect(slug).toBe(slugWithContext);
    });
    it("returns the slug as is when it already has context", () => {
      const slug = addContextToSlug(slugWithContext, orgKey);
      expect(slug).toBe(slugWithContext);
    });
    it("returns the slug as is when it has a different context", () => {
      const slug = addContextToSlug(slugWithContext, "another-org");
      expect(slug).toBe(slugWithContext);
    });
  });
});
