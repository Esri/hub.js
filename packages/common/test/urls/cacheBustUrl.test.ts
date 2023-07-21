import { cacheBustUrl } from "../../src";

describe("cacheBustUrl:", () => {
  it("returns null if passed null", () => {
    expect(cacheBustUrl(null)).toBe(null);
  });

  it("adds datestamp to url", () => {
    const url = "https://foo.com/bar";
    const result = cacheBustUrl(url);
    expect(result).toContain(url);
    expect(result).toContain("?v=");
  });
  it("adds datestamp to url", () => {
    const url = "https://foo.com/bar?up=down";
    const result = cacheBustUrl(url);
    expect(result).toContain(url);
    expect(result).toContain("&v=");
  });
});
