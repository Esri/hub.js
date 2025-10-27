import { vi, describe, it, expect } from "vitest";
import { fetchAndUploadThumbnail } from "../../src/resources/fetch-and-upload-thumbnail";
import * as fetchImageAsBlobModule from "../../src/resources/fetch-image-as-blob";
import * as portalModule from "../../src/rest/portal/wrappers";

import { mockUserSession } from "../test-helpers/fake-user-session";

describe("fetchAndUploadThumbnail", function () {
  // These tests create a blob
  if (typeof Blob !== "undefined") {
    it("fetches and uploads a thumbnail", async function () {
      const file = new Blob(["a"]);
      const opts = {
        id: "my-id",
        owner: "owner",
        fileName: "file",
        url: "some-url",
        authentication: mockUserSession,
      };

      vi.spyOn(fetchImageAsBlobModule, "fetchImageAsBlob").mockReturnValue(
        Promise.resolve(file)
      );
      vi.spyOn(portalModule, "updateItem").mockReturnValue(
        Promise.resolve({ success: true, id: opts.id })
      );

      await fetchAndUploadThumbnail(opts);

      expect(fetchImageAsBlobModule.fetchImageAsBlob).toHaveBeenCalledWith(
        opts.url
      );

      expect(portalModule.updateItem).toHaveBeenCalled();
    });
    it("is impervious to thumbnail upload failure", async function () {
      const file = new Blob(["a"]);
      const opts = {
        id: "my-id",
        owner: "owner",
        fileName: "file",
        url: "some-url",
        authentication: mockUserSession,
      };

      vi.spyOn(fetchImageAsBlobModule, "fetchImageAsBlob").mockReturnValue(
        Promise.resolve(file)
      );
      vi.spyOn(portalModule, "updateItem").mockReturnValue(Promise.reject({}));

      await fetchAndUploadThumbnail(opts);

      expect(fetchImageAsBlobModule.fetchImageAsBlob).toHaveBeenCalledWith(
        opts.url
      );

      expect(portalModule.updateItem).toHaveBeenCalled();
    });
  }

  it("is impervious to fetch-thumbnail failure", async function () {
    const opts = {
      id: "my-id",
      owner: "owner",
      fileName: "file",
      url: "some-url",
      authentication: mockUserSession,
    };

    vi.spyOn(fetchImageAsBlobModule, "fetchImageAsBlob").mockReturnValue(
      Promise.reject({})
    );
    vi.spyOn(portalModule, "updateItem").mockReturnValue(
      Promise.resolve({ success: true, id: opts.id })
    );

    await fetchAndUploadThumbnail(opts);

    expect(fetchImageAsBlobModule.fetchImageAsBlob).toHaveBeenCalledWith(
      opts.url
    );

    expect(portalModule.updateItem).not.toHaveBeenCalled();
  });
});
