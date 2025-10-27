import { describe, it, expect, afterEach } from "vitest";
import fetchMock from "fetch-mock";
import { fetchImageAsBlob } from "../../src/resources/fetch-image-as-blob";

describe("fetchImageAsBlob", () => {
  afterEach(() => {
    fetchMock.restore();
  });

  if (typeof Blob !== "undefined") {
    it("fetches an image as a blob", async () => {
      fetchMock.getOnce("image-url", {
        body: new Blob(["a"], { type: "image/png" }),
        sendAsJson: false,
      });

      const res = await fetchImageAsBlob("image-url", {
        credentials: "omit",
      } as any);

      expect(fetchMock.done()).toBeTruthy();
      expect((fetchMock.lastCall() as any)[1].credentials).toBe("omit");
      expect(res.size).toBeGreaterThan(0);
    });

    it("has sensible defaults", async () => {
      fetchMock.getOnce("image-url", {
        body: new Blob(["a"], { type: "image/png" }),
        sendAsJson: false,
      });

      const res = await fetchImageAsBlob("image-url");

      expect(fetchMock.done()).toBeTruthy();
      expect((fetchMock.lastCall() as any)[1].credentials).toBe("same-origin");
      expect(res.size).toBeGreaterThan(0);
    });
  } else {
    it("does not test in node", () => true);
  }
});
