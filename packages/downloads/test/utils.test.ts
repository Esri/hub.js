import { DownloadTarget } from "../src/download-target";
import { urlBuilder, composeDownloadId, isRecentlyUpdated } from "../src/utils";

describe("utils", () => {
  describe("urlBuilder", () => {
    it("should build url without query params", done => {
      const result = urlBuilder({
        host: "https://test.com",
        route: "/foo/bar"
      });
      expect(result).toEqual("https://test.com/foo/bar");
      done();
    });

    it("should build url with query params", done => {
      const result = urlBuilder({
        host: "https://test.com",
        route: "/foo/bar",
        query: { hello: "world" }
      });
      expect(result).toEqual("https://test.com/foo/bar?hello=world");
      done();
    });

    it("should build url when host", done => {
      const result = urlBuilder({
        host: "https://test.com/",
        route: "/foo/bar"
      });
      expect(result).toEqual("https://test.com/foo/bar");
      done();
    });
  });

  describe("composeDownloadId", () => {
    it("should compose download ID with all parameters defined", done => {
      const result = composeDownloadId({
        datasetId: "abc",
        format: "efg",
        spatialRefId: "1234",
        geometry: "geom-envelope",
        where: "1=1"
      });
      expect(result).toEqual("abc:efg:1234:geom-envelope:1=1");
      done();
    });

    it("should compose download ID with optional parameters undefined", done => {
      const result = composeDownloadId({
        datasetId: "abc",
        format: "efg"
      });
      expect(result).toEqual("abc:efg:undefined:undefined:undefined");
      done();
    });
  });

  describe("isRecentlyUpdated", () => {
    it('should return false if target is not "portal", even if data was recently updated', done => {
      const targetOne: DownloadTarget = undefined;
      const targetTwo: DownloadTarget = "hub";
      const targetThree: DownloadTarget = "enterprise";
      const lastEditDate: number = new Date().getTime();

      expect(isRecentlyUpdated(targetOne, lastEditDate)).toBeFalsy();
      expect(isRecentlyUpdated(targetTwo, lastEditDate)).toBeFalsy();
      expect(isRecentlyUpdated(targetThree, lastEditDate)).toBeFalsy();
      done();
    });

    it("should return false for any target if data was recently updated", done => {
      const targetOne: DownloadTarget = undefined;
      const targetTwo: DownloadTarget = "hub";
      const targetThree: DownloadTarget = "enterprise";
      const targetFour: DownloadTarget = "portal";
      const lastEditDate: number = 1000;

      expect(isRecentlyUpdated(targetOne, lastEditDate)).toBeFalsy();
      expect(isRecentlyUpdated(targetTwo, lastEditDate)).toBeFalsy();
      expect(isRecentlyUpdated(targetThree, lastEditDate)).toBeFalsy();
      expect(isRecentlyUpdated(targetFour, lastEditDate)).toBeFalsy();
      done();
    });

    it('should return true only if target is "portal" and if data was recently updated', done => {
      const target: DownloadTarget = "portal";
      const lastEditDate: number = new Date().getTime();

      expect(isRecentlyUpdated(target, lastEditDate)).toBeTruthy();
      done();
    });
  });
});
