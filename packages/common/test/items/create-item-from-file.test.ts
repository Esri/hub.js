import { createItemFromFile } from "../../src/items/create-item-from-file";
import * as portal from "@esri/arcgis-rest-portal";
import * as _prepareUploadRequestsModule from "../../src/items/_internal/_prepare-upload-requests";
import { IUserRequestOptions } from "@esri/arcgis-rest-auth";
import { IItemAdd } from "@esri/arcgis-rest-types";

describe("createItemFromFile", () => {
  if (typeof Blob !== "undefined") {
    it("Properly creates item", async () => {
      // request options
      const ro = {
        authentication: {
          portal: "http://some-org.mapsqaext.arcgis.com",
        },
      } as IUserRequestOptions;
      // fake item
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
      // spies
      const createItemSpy = spyOn(portal, "createItem").and.returnValue(
        Promise.resolve({ id: "123abc", success: true, folder: "test" })
      );
      const cancelItemSpy = spyOn(portal, "cancelItemUpload").and.returnValue(
        Promise.resolve({ success: true, id: "123abc" })
      );
      const addItemPartSpy = spyOn(portal, "addItemPart").and.callFake(() =>
        Promise.resolve({ success: true })
      );
      const commitItemUploadSpy = spyOn(
        portal,
        "commitItemUpload"
      ).and.returnValue(Promise.resolve({ success: true, id: "123abc" }));
      const _prepareUploadRequestsSpy = spyOn(
        _prepareUploadRequestsModule,
        "_prepareUploadRequests"
      ).and.returnValue([{}, {}, {}]);
      const result = await createItemFromFile(item, ro);
      expect(result).toEqual({ id: "123abc", success: true, folder: "test" });
      expect(addItemPartSpy).toHaveBeenCalledTimes(3);
      expect(createItemSpy).toHaveBeenCalledTimes(1);
      expect(commitItemUploadSpy).toHaveBeenCalledTimes(1);
      expect(commitItemUploadSpy.calls.argsFor(0)[0].item.extent).toEqual(
        "1, 2, 3, 4"
      );
      expect(_prepareUploadRequestsSpy).toHaveBeenCalledTimes(1);
      expect(cancelItemSpy).not.toHaveBeenCalled();
    });
    it("Properly creates item w/ string extent", async () => {
      // request options
      const ro = {
        authentication: {
          portal: "http://some-org.mapsqaext.arcgis.com",
        },
      } as IUserRequestOptions;
      // fake item
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
      // spies
      const createItemSpy = spyOn(portal, "createItem").and.returnValue(
        Promise.resolve({ id: "123abc", success: true, folder: "test" })
      );
      const cancelItemSpy = spyOn(portal, "cancelItemUpload").and.returnValue(
        Promise.resolve({ success: true, id: "123abc" })
      );
      const addItemPartSpy = spyOn(portal, "addItemPart").and.callFake(() =>
        Promise.resolve({ success: true })
      );
      const commitItemUploadSpy = spyOn(
        portal,
        "commitItemUpload"
      ).and.returnValue(Promise.resolve({ success: true, id: "123abc" }));
      const _prepareUploadRequestsSpy = spyOn(
        _prepareUploadRequestsModule,
        "_prepareUploadRequests"
      ).and.returnValue([{}, {}, {}]);
      const result = await createItemFromFile(item, ro);
      expect(result).toEqual({ id: "123abc", success: true, folder: "test" });
      expect(addItemPartSpy).toHaveBeenCalledTimes(3);
      expect(createItemSpy).toHaveBeenCalledTimes(1);
      expect(commitItemUploadSpy).toHaveBeenCalledTimes(1);
      expect(commitItemUploadSpy.calls.argsFor(0)[0].item.extent).toEqual(
        "1, 2, 3, 4"
      );
      expect(_prepareUploadRequestsSpy).toHaveBeenCalledTimes(1);
      expect(cancelItemSpy).not.toHaveBeenCalled();
    });
    it("Properly fails and cancels item upload if necessary", async () => {
      // request options
      const ro = {
        authentication: {
          portal: "http://some-org.mapsqaext.arcgis.com",
        },
      } as IUserRequestOptions;
      // fake item
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
      // spies
      const createItemSpy = spyOn(portal, "createItem").and.returnValue(
        Promise.resolve({ success: true, id: "123abc" })
      );
      const cancelItemSpy = spyOn(portal, "cancelItemUpload").and.returnValue(
        Promise.resolve({ success: true, id: "123abc" })
      );
      const addItemPartSpy = spyOn(portal, "addItemPart").and.callFake(() =>
        Promise.reject(Error("xhr failed"))
      );
      const commitItemUploadSpy = spyOn(
        portal,
        "commitItemUpload"
      ).and.returnValue(Promise.resolve({ success: true, id: "123abc" }));
      const _prepareUploadRequestsSpy = spyOn(
        _prepareUploadRequestsModule,
        "_prepareUploadRequests"
      ).and.returnValue([{}, {}, {}]);
      try {
        const result = await createItemFromFile(item, ro);
        expect(addItemPartSpy).toHaveBeenCalledTimes(3);
        expect(createItemSpy).toHaveBeenCalledTimes(1);
        expect(commitItemUploadSpy).not.toHaveBeenCalled();
        expect(_prepareUploadRequestsSpy).toHaveBeenCalledTimes(1);
      } catch (err) {
        expect(cancelItemSpy).toHaveBeenCalledTimes(1);
      }
    });
    it("Properly fails and cancels item upload if addItemPart returns success: false", async () => {
      // request options
      const ro = {
        authentication: {
          portal: "http://some-org.mapsqaext.arcgis.com",
        },
      } as IUserRequestOptions;
      // fake item
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
      // spies
      const createItemSpy = spyOn(portal, "createItem").and.returnValue(
        Promise.resolve({ success: true, id: "123abc" })
      );
      const cancelItemSpy = spyOn(portal, "cancelItemUpload").and.returnValue(
        Promise.resolve({ success: true, id: "123abc" })
      );
      const addItemPartSpy = spyOn(portal, "addItemPart").and.callFake(() =>
        Promise.resolve({ success: false })
      );
      const commitItemUploadSpy = spyOn(
        portal,
        "commitItemUpload"
      ).and.returnValue(Promise.resolve({ success: true, id: "123abc" }));
      const _prepareUploadRequestsSpy = spyOn(
        _prepareUploadRequestsModule,
        "_prepareUploadRequests"
      ).and.returnValue([{}, {}, {}]);
      try {
        const result = await createItemFromFile(item, ro);
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
