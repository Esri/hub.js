// make ESM namespace spyable by merging original exports and overriding specific
// functions with vi.fn. This must run before importing the module.
vi.mock("@esri/arcgis-rest-portal", async (importOriginal: any) => {
  const mod = await importOriginal();
  return Object.assign({}, mod, {
    cancelItemUpload: vi.fn(),
    addItemPart: vi.fn(),
    commitItemUpload: vi.fn(),
  });
});

import { createItemFromFile } from "../../src/items/create-item-from-file";
import * as portal from "@esri/arcgis-rest-portal";
import * as _prepareUploadRequestsModule from "../../src/items/_internal/_prepare-upload-requests";
import type { IUserRequestOptions } from "@esri/arcgis-rest-request";
import type { IItemAdd } from "@esri/arcgis-rest-portal";
import * as restPortal from "../../src/rest/portal/wrappers";
import { afterEach, describe, expect, it, vi } from "vitest";

describe("createItemFromFile", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  if (typeof Blob !== "undefined") {
    it("Properly creates item", async () => {
      const ro = {
        authentication: {
          portal: "http://some-org.mapsqaext.arcgis.com",
        },
      } as IUserRequestOptions;
      const item = {
        title: "Test.csv",
        type: "csv",
        owner: "test",
        dataUrl: "https://test.com",
        text: "This is a test",
        async: false,
        access: "private",
        extent: [
          [1, 2],
          [3, 4],
        ],
        file: new Blob(["foo"], { type: "csv" }),
      } as IItemAdd;

      const createItemSpy = vi
        .spyOn(restPortal as any, "createItem")
        .mockReturnValue(
          Promise.resolve({ id: "123abc", success: true, folder: "test" })
        );
      const cancelItemSpy = vi
        .spyOn(portal as any, "cancelItemUpload")
        .mockReturnValue(Promise.resolve({ success: true, id: "123abc" }));
      const addItemPartSpy = vi
        .spyOn(portal as any, "addItemPart")
        .mockImplementation(() => Promise.resolve({ success: true }));
      const commitItemUploadSpy = vi
        .spyOn(portal as any, "commitItemUpload")
        .mockReturnValue(Promise.resolve({ success: true, id: "123abc" }));
      const _prepareUploadRequestsSpy = vi
        .spyOn(_prepareUploadRequestsModule as any, "_prepareUploadRequests")
        .mockReturnValue([{}, {}, {}]);

      const result = await createItemFromFile(item, ro);
      expect(result).toEqual({ id: "123abc", success: true, folder: "test" });
      expect(addItemPartSpy).toHaveBeenCalledTimes(3);
      expect(createItemSpy).toHaveBeenCalledTimes(1);
      expect(commitItemUploadSpy).toHaveBeenCalledTimes(1);
      expect((commitItemUploadSpy.mock.calls[0][0] as any).item.extent).toEqual(
        "1, 2, 3, 4"
      );
      expect(_prepareUploadRequestsSpy).toHaveBeenCalledTimes(1);
      expect(cancelItemSpy).not.toHaveBeenCalled();
    });

    it("Properly creates item w/ string extent", async () => {
      const ro = {
        authentication: {
          portal: "http://some-org.mapsqaext.arcgis.com",
        },
      } as IUserRequestOptions;
      const item = {
        title: "Test.csv",
        type: "csv",
        owner: "test",
        dataUrl: "https://test.com",
        text: "This is a test",
        async: false,
        access: "private",
        extent: "1, 2, 3, 4",
        file: new Blob(["foo"], { type: "csv" }),
      } as unknown as IItemAdd;

      const createItemSpy = vi
        .spyOn(restPortal as any, "createItem")
        .mockReturnValue(
          Promise.resolve({ id: "123abc", success: true, folder: "test" })
        );
      const cancelItemSpy = vi
        .spyOn(portal as any, "cancelItemUpload")
        .mockReturnValue(Promise.resolve({ success: true, id: "123abc" }));
      const addItemPartSpy = vi
        .spyOn(portal as any, "addItemPart")
        .mockImplementation(() => Promise.resolve({ success: true }));
      const commitItemUploadSpy = vi
        .spyOn(portal as any, "commitItemUpload")
        .mockReturnValue(Promise.resolve({ success: true, id: "123abc" }));
      const _prepareUploadRequestsSpy = vi
        .spyOn(_prepareUploadRequestsModule as any, "_prepareUploadRequests")
        .mockReturnValue([{}, {}, {}]);

      const result = await createItemFromFile(item, ro);
      expect(result).toEqual({ id: "123abc", success: true, folder: "test" });
      expect(addItemPartSpy).toHaveBeenCalledTimes(3);
      expect(createItemSpy).toHaveBeenCalledTimes(1);
      expect(commitItemUploadSpy).toHaveBeenCalledTimes(1);
      expect((commitItemUploadSpy.mock.calls[0][0] as any).item.extent).toEqual(
        "1, 2, 3, 4"
      );
      expect(_prepareUploadRequestsSpy).toHaveBeenCalledTimes(1);
      expect(cancelItemSpy).not.toHaveBeenCalled();
    });

    it("Properly fails and cancels item upload if necessary", async () => {
      const ro = {
        authentication: {
          portal: "http://some-org.mapsqaext.arcgis.com",
        },
      } as IUserRequestOptions;
      const item = {
        title: "Test.csv",
        type: "csv",
        owner: "test",
        dataUrl: "https://test.com",
        text: "This is a test",
        async: false,
        file: {
          name: "test test test",
        },
      } as IItemAdd;

      const createItemSpy = vi
        .spyOn(restPortal as any, "createItem")
        .mockReturnValue(Promise.resolve({ success: true, id: "123abc" }));
      const cancelItemSpy = vi
        .spyOn(portal as any, "cancelItemUpload")
        .mockReturnValue(Promise.resolve({ success: true, id: "123abc" }));
      const addItemPartSpy = vi
        .spyOn(portal as any, "addItemPart")
        .mockImplementation(() => Promise.reject(Error("xhr failed")));
      const commitItemUploadSpy = vi
        .spyOn(portal as any, "commitItemUpload")
        .mockReturnValue(Promise.resolve({ success: true, id: "123abc" }));
      const _prepareUploadRequestsSpy = vi
        .spyOn(_prepareUploadRequestsModule as any, "_prepareUploadRequests")
        .mockReturnValue([{}, {}, {}]);

      try {
        await createItemFromFile(item, ro);
        expect(addItemPartSpy).toHaveBeenCalledTimes(3);
        expect(createItemSpy).toHaveBeenCalledTimes(1);
        expect(commitItemUploadSpy).not.toHaveBeenCalled();
        expect(_prepareUploadRequestsSpy).toHaveBeenCalledTimes(1);
      } catch (err) {
        expect(cancelItemSpy).toHaveBeenCalledTimes(1);
      }
    });

    it("Properly fails and cancels item upload if addItemPart returns success: false", async () => {
      const ro = {
        authentication: {
          portal: "http://some-org.mapsqaext.arcgis.com",
        },
      } as IUserRequestOptions;
      const item = {
        title: "Test.csv",
        type: "csv",
        owner: "test",
        dataUrl: "https://test.com",
        text: "This is a test",
        async: false,
        file: {
          name: "test test test",
        },
      } as IItemAdd;

      const createItemSpy = vi
        .spyOn(restPortal as any, "createItem")
        .mockReturnValue(Promise.resolve({ success: true, id: "123abc" }));
      const cancelItemSpy = vi
        .spyOn(portal as any, "cancelItemUpload")
        .mockReturnValue(Promise.resolve({ success: true, id: "123abc" }));
      const addItemPartSpy = vi
        .spyOn(portal as any, "addItemPart")
        .mockImplementation(() => Promise.resolve({ success: false }));
      const commitItemUploadSpy = vi
        .spyOn(portal as any, "commitItemUpload")
        .mockReturnValue(Promise.resolve({ success: true, id: "123abc" }));
      const _prepareUploadRequestsSpy = vi
        .spyOn(_prepareUploadRequestsModule as any, "_prepareUploadRequests")
        .mockReturnValue([{}, {}, {}]);

      try {
        await createItemFromFile(item, ro);
        expect(addItemPartSpy).toHaveBeenCalledTimes(3);
        expect(createItemSpy).toHaveBeenCalledTimes(1);
        expect(commitItemUploadSpy).not.toHaveBeenCalled();
        expect(_prepareUploadRequestsSpy).toHaveBeenCalledTimes(1);
      } catch (err) {
        expect(cancelItemSpy).toHaveBeenCalledTimes(1);
      }
    });
  } else {
    it("does not test in node", () => true);
  }
});
