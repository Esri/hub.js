import { buildUrl } from "../../src/urls/build-url";

describe("urls", () => {
  describe("buildUrl", () => {
    it("should build url without query params", () => {
      const result = buildUrl({ host: "https://test.com", path: "/foo/bar" });
      expect(result).toEqual("https://test.com/foo/bar");
    });

    it("should build url with query params", () => {
      const result = buildUrl({
        host: "https://test.com",
        path: "/foo/bar",
        query: { hello: "world" },
      });
      expect(result).toEqual("https://test.com/foo/bar?hello=world");
    });

    it("should build url when host ends with slash", () => {
      const result = buildUrl({ host: "https://test.com/", path: "/foo/bar" });
      expect(result).toEqual("https://test.com/foo/bar");
    });
  });
});
