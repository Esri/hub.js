import { fetchImageAsBlob } from "../../src";
import * as fetchMock from "fetch-mock";

describe("fetchImageAsBlob", function() {
  // These tests create a blob
  if (typeof Blob !== "undefined") {
    it("fetches an image as a blob", async function() {
      fetchMock.getOnce("image-url", {
        body: new Blob(["a"], { type: "image/png" }),
        sendAsJson: false
      });

      const res = await fetchImageAsBlob("image-url", { credentials: "omit" });

      expect(fetchMock.done()).toBeTruthy();
      expect(fetchMock.lastCall()[1].credentials).toBe(
        "omit",
        "called with specified credential"
      );
      expect(res.size).toBeGreaterThan(0);
    });

    it("has sensible defaults", async function() {
      fetchMock.getOnce("image-url", {
        body: new Blob(["a"], { type: "image/png" }),
        sendAsJson: false
      });

      const res = await fetchImageAsBlob("image-url");

      expect(fetchMock.done()).toBeTruthy();
      expect(fetchMock.lastCall()[1].credentials).toBe(
        "same-origin",
        "Defaults credentials to same-origin"
      );
      expect(res.size).toBeGreaterThan(0);
    });
  }
});
