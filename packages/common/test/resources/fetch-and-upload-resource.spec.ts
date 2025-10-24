import { vi, describe, it, expect, afterEach } from "vitest";

vi.mock("@esri/arcgis-rest-portal", async (importOriginal) => ({
  ...(await importOriginal()),
  addItemResource: vi.fn(),
  getItemResources: vi.fn(),
}));

import { mockUserSession } from "../test-helpers/fake-user-session";
import * as fetchImageAsBlobModule from "../../src/resources/fetch-image-as-blob";
import * as portalModule from "@esri/arcgis-rest-portal";

import {
  IItemResourceOptions,
  IItemResourceResponse,
} from "@esri/arcgis-rest-portal";
import { fetchAndUploadResource } from "../../src/resources/fetch-and-upload-resource";

describe("fetchAndUploadResource", () => {
  afterEach(() => vi.restoreAllMocks());

  if (typeof Blob !== "undefined") {
    it("fetches and uploads a resource", async () => {
      const owner = "andrew";
      const itemId = "some-id";

      const resourceBlob = new Blob([], { type: "image/png" });
      const fetchImageAsBlobSpy = vi
        .spyOn(fetchImageAsBlobModule, "fetchImageAsBlob")
        .mockResolvedValue(resourceBlob as any);

      const addResourceRes: IItemResourceResponse = {
        success: true,
        itemId,
        owner,
        folder: null,
      };
      const addItemResourceSpy = vi
        .spyOn(portalModule, "addItemResource")
        .mockResolvedValue(addResourceRes as any);

      const opts = {
        id: itemId,
        owner,
        fileName: "thumbnail.png",
        url: "https://my-image-url",
        authentication: mockUserSession,
      };

      const res = await fetchAndUploadResource(opts as any);

      expect((fetchImageAsBlobSpy as any).mock.calls.length).toBe(1);
      const fetchArgs = (fetchImageAsBlobSpy as any).mock.calls[0];
      expect(fetchArgs[0]).toBe(opts.url);

      expect((addItemResourceSpy as any).mock.calls.length).toBe(1);
      expect(res).toEqual(addResourceRes);
      const addItemOpts: IItemResourceOptions = (addItemResourceSpy as any).mock
        .calls[0][0];
      expect(addItemOpts).toEqual({
        id: itemId,
        owner,
        name: opts.fileName,
        resource: resourceBlob,
        authentication: mockUserSession,
      });
    });
  } else {
    it("does not test in node", () => true);
  }
});
