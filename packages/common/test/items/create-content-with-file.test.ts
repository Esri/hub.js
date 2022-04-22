import { createContentWithFile } from "../../src/items/create-content-with-file";
import * as portal from "@esri/arcgis-rest-portal";
// import * as _multiThreadUploadModule from "../../src/items/_internal/_multi-thread-upload";
import * as _prepareUploadRequestsModule from "../../src/items/_internal/_prepare-upload-requests";
import { IUserRequestOptions } from "@esri/arcgis-rest-auth";
import { IItemAdd } from "@esri/arcgis-rest-types";

describe("createContentWithFile", () => {
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
      file: {
        name: "test test test",
      },
    } as IItemAdd;
    const fakeXhrSpy = jasmine
      .createSpy()
      .and.callFake(() => Promise.resolve("Success"));
    // spies
    const createItemSpy = spyOn(portal, "createItem").and.returnValue(
      Promise.resolve({ success: true, id: "123abc" })
    );
    const cancelItemSpy = spyOn(portal, "cancelItemUpload").and.returnValue(
      Promise.resolve({ success: true, id: "123abc" })
    );
    const commitItemUploadSpy = spyOn(
      portal,
      "commitItemUpload"
    ).and.returnValue(Promise.resolve({ success: true, id: "123abc" }));
    const _prepareUploadRequestsSpy = spyOn(
      _prepareUploadRequestsModule,
      "_prepareUploadRequests"
    ).and.returnValue([
      fakeXhrSpy,
      fakeXhrSpy,
      fakeXhrSpy,
      fakeXhrSpy,
      fakeXhrSpy,
      fakeXhrSpy,
    ]);
    const result = await createContentWithFile(item, ro);
    expect(result).toBe("123abc");
    expect(fakeXhrSpy).toHaveBeenCalledTimes(6);
    expect(createItemSpy).toHaveBeenCalledTimes(1);
    expect(commitItemUploadSpy).toHaveBeenCalledTimes(1);
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
    const fakeXhrSpy = jasmine
      .createSpy()
      .and.callFake(() => Promise.reject(Error("xhr failed")));
    // spies
    const createItemSpy = spyOn(portal, "createItem").and.returnValue(
      Promise.resolve({ success: true, id: "123abc" })
    );
    const cancelItemSpy = spyOn(portal, "cancelItemUpload").and.returnValue(
      Promise.resolve({ success: true, id: "123abc" })
    );
    const commitItemUploadSpy = spyOn(
      portal,
      "commitItemUpload"
    ).and.returnValue(Promise.resolve({ success: true, id: "123abc" }));
    const _prepareUploadRequestsSpy = spyOn(
      _prepareUploadRequestsModule,
      "_prepareUploadRequests"
    ).and.returnValue([
      fakeXhrSpy,
      fakeXhrSpy,
      fakeXhrSpy,
      fakeXhrSpy,
      fakeXhrSpy,
      fakeXhrSpy,
    ]);
    try {
      const result = await createContentWithFile(item, ro);
      expect(fakeXhrSpy).toHaveBeenCalledTimes(6);
      expect(createItemSpy).toHaveBeenCalledTimes(1);
      expect(commitItemUploadSpy).not.toHaveBeenCalled();
      expect(_prepareUploadRequestsSpy).toHaveBeenCalledTimes(1);
    } catch (err) {
      expect(cancelItemSpy).toHaveBeenCalledTimes(1);
    }
  });
});
