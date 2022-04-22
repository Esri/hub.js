import { IUserRequestOptions } from "@esri/arcgis-rest-auth";
import { IItemAdd } from "@esri/arcgis-rest-types";
import { createContent } from "../../src/items/create-content";
import * as createContentWithFileModule from "../../src/items/create-content-with-file";
import * as createContentWithUrlModule from "../../src/items/create-content-with-url";
import * as _waitForItemReadyModule from "../../src/items/_internal/_wait-for-item-ready";
import * as portal from "@esri/arcgis-rest-portal";

describe("createContent", () => {
  it("creates an item from url", async () => {
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
      access: "org",
    } as IItemAdd;

    const createContentWithFileSpy = spyOn(
      createContentWithFileModule,
      "createContentWithFile"
    ).and.returnValue(Promise.resolve("123abc"));
    const createContentWithUrlSpy = spyOn(
      createContentWithUrlModule,
      "createContentWithUrl"
    ).and.returnValue(Promise.resolve("123abc"));
    const _waitForItemReadySpy = spyOn(
      _waitForItemReadyModule,
      "_waitForItemReady"
    ).and.callFake(() => Promise.resolve());
    const setItemAccessSpy = spyOn(portal, "setItemAccess").and.callFake(() =>
      Promise.resolve()
    );

    const result = await createContent(item, ro);

    expect(result).toBe("123abc");
    expect(createContentWithFileSpy).not.toHaveBeenCalled();
    expect(createContentWithUrlSpy).toHaveBeenCalledTimes(1);
    expect(_waitForItemReadySpy).toHaveBeenCalledTimes(1);
    expect(setItemAccessSpy).toHaveBeenCalledTimes(1);
  });
  it("creates an item from url without dataUrl", async () => {
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
      text: "This is a test",
      async: false,
      access: "org",
    } as IItemAdd;

    const createContentWithFileSpy = spyOn(
      createContentWithFileModule,
      "createContentWithFile"
    ).and.returnValue(Promise.resolve("123abc"));
    const createContentWithUrlSpy = spyOn(
      createContentWithUrlModule,
      "createContentWithUrl"
    ).and.returnValue(Promise.resolve("123abc"));
    const _waitForItemReadySpy = spyOn(
      _waitForItemReadyModule,
      "_waitForItemReady"
    ).and.callFake(() => Promise.resolve());
    const setItemAccessSpy = spyOn(portal, "setItemAccess").and.callFake(() =>
      Promise.resolve()
    );

    const result = await createContent(item, ro);

    expect(result).toBe("123abc");
    expect(createContentWithFileSpy).not.toHaveBeenCalled();
    expect(createContentWithUrlSpy).toHaveBeenCalledTimes(1);
    expect(_waitForItemReadySpy).not.toHaveBeenCalled();
    expect(setItemAccessSpy).toHaveBeenCalledTimes(1);
  });
  it("creates an item from file", async () => {
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
      access: "private",
    } as IItemAdd;

    const createContentWithFileSpy = spyOn(
      createContentWithFileModule,
      "createContentWithFile"
    ).and.returnValue(Promise.resolve("123abc"));
    const createContentWithUrlSpy = spyOn(
      createContentWithUrlModule,
      "createContentWithUrl"
    ).and.returnValue(Promise.resolve("123abc"));
    const _waitForItemReadySpy = spyOn(
      _waitForItemReadyModule,
      "_waitForItemReady"
    ).and.callFake(() => Promise.resolve());
    const setItemAccessSpy = spyOn(portal, "setItemAccess").and.callFake(() =>
      Promise.resolve()
    );

    const result = await createContent(item, ro);

    expect(result).toBe("123abc");
    expect(createContentWithFileSpy).toHaveBeenCalledTimes(1);
    expect(createContentWithUrlSpy).not.toHaveBeenCalled();
    expect(_waitForItemReadySpy).toHaveBeenCalledTimes(1);
    expect(setItemAccessSpy).not.toHaveBeenCalled();
  });
});
