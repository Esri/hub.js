import { buildUrl } from "../../src";

describe("urls", () => {
  describe("buildUrl", () => {
    it("should build url without query params", done => {
      const result = buildUrl({ host: "https://test.com", path: "/foo/bar" });
      expect(result).toEqual("https://test.com/foo/bar");
      done();
    });

    it("should build url with query params", done => {
      const result = buildUrl({
        host: "https://test.com",
        path: "/foo/bar",
        query: { hello: "world" }
      });
      expect(result).toEqual("https://test.com/foo/bar?hello=world");
      done();
    });

    it("should build url when host ends with slash", done => {
      const result = buildUrl({ host: "https://test.com/", path: "/foo/bar" });
      expect(result).toEqual("https://test.com/foo/bar");
      done();
    });
  });
});
