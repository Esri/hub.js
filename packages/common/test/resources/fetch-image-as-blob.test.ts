import { fetchImageAsBlob } from "../../src";
import { Blob } from "../../src/resources/_which-blob";
import * as fetchMock from "fetch-mock";

describe("fetchImageAsBlob", function() {
  it("fetches an image as a blob", async function() {
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
});
