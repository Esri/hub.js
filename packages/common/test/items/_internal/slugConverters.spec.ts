import {
  keywordSlugToUriSlug,
  uriSlugToKeywordSlug,
} from "../../../src/items/_internal/slugConverters";

describe("slug conversions:", () => {
  it("converts kwd slug to uri slugs", () => {
    expect(keywordSlugToUriSlug("slug|foo-bar")).toBe("slug::foo-bar");
    expect(keywordSlugToUriSlug("slug::foo-bar")).toBe("slug::foo-bar");
    expect(keywordSlugToUriSlug("foo-bar")).toBe("foo-bar");
  });

  it("converts uri slug to kwd slugs", () => {
    expect(uriSlugToKeywordSlug("foo-bar")).toBe("foo-bar");
    expect(uriSlugToKeywordSlug("slug::foo-bar")).toBe("slug|foo-bar");
  });
});
