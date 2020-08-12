import * as fetchImageAsBlobModule from "../../src/resources/fetch-image-as-blob";
import * as portalModule from "@esri/arcgis-rest-portal";

import { fetchAndUploadThumbnail } from "../../src";
import { mockUserSession } from "../test-helpers/fake-user-session";

describe("fetchAndUploadThumbnail", function() {
  // These tests create a blob
  if (typeof Blob !== "undefined") {
    it("fetches and uploads a thumbnail", async function() {
      const file = new Blob(["a"]);
      const opts = {
        id: "my-id",
        owner: "owner",
        fileName: "file",
        url: "some-url",
        authentication: mockUserSession
      };

      spyOn(fetchImageAsBlobModule, "fetchImageAsBlob").and.returnValue(
        Promise.resolve(file)
      );
      spyOn(portalModule, "updateItem").and.returnValue(
        Promise.resolve({ success: true, id: opts.id })
      );

      await fetchAndUploadThumbnail(opts);

      expect(fetchImageAsBlobModule.fetchImageAsBlob).toHaveBeenCalledWith(
        opts.url
      );

      expect(portalModule.updateItem).toHaveBeenCalled();
    });
    it("is impervious to thumbnail upload failure", async function() {
      const file = new Blob(["a"]);
      const opts = {
        id: "my-id",
        owner: "owner",
        fileName: "file",
        url: "some-url",
        authentication: mockUserSession
      };

      spyOn(fetchImageAsBlobModule, "fetchImageAsBlob").and.returnValue(
        Promise.resolve(file)
      );
      spyOn(portalModule, "updateItem").and.returnValue(Promise.reject({}));

      try {
        await fetchAndUploadThumbnail(opts);
      } catch (err) {
        fail(Error("shouldnt reject"));
      }

      expect(fetchImageAsBlobModule.fetchImageAsBlob).toHaveBeenCalledWith(
        opts.url
      );

      expect(portalModule.updateItem).toHaveBeenCalled();
    });
  }

  it("is impervious to fetch-thumbnail failure", async function() {
    const opts = {
      id: "my-id",
      owner: "owner",
      fileName: "file",
      url: "some-url",
      authentication: mockUserSession
    };

    spyOn(fetchImageAsBlobModule, "fetchImageAsBlob").and.returnValue(
      Promise.reject({})
    );
    spyOn(portalModule, "updateItem").and.returnValue(
      Promise.resolve({ success: true, id: opts.id })
    );

    try {
      await fetchAndUploadThumbnail(opts);
    } catch (err) {
      fail(Error("shouldnt reject"));
    }

    expect(fetchImageAsBlobModule.fetchImageAsBlob).toHaveBeenCalledWith(
      opts.url
    );

    expect(portalModule.updateItem).not.toHaveBeenCalled();
  });
});
