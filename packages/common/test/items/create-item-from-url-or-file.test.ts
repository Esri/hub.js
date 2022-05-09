import { IUserRequestOptions } from "@esri/arcgis-rest-auth";
import { IGroup, IItemAdd } from "@esri/arcgis-rest-types";
import { createItemFromUrlOrFile } from "../../src/items/create-item-from-url-or-file";
import * as createItemFromFileModule from "../../src/items/create-item-from-file";
import * as createItemFromUrlModule from "../../src/items/create-item-from-url";
import * as _waitForItemReadyModule from "../../src/items/_internal/_wait-for-item-ready";
import * as portal from "@esri/arcgis-rest-portal";

describe("createItemFromUrlOrFile", () => {
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

    const createItemFromFileSpy = spyOn(
      createItemFromFileModule,
      "createItemFromFile"
    ).and.returnValue(
      Promise.resolve({ id: "123abc", success: true, folder: "test" })
    );
    const createItemFromUrlSpy = spyOn(
      createItemFromUrlModule,
      "createItemFromUrl"
    ).and.returnValue(
      Promise.resolve({ id: "123abc", success: true, folder: "test" })
    );
    const _waitForItemReadySpy = spyOn(
      _waitForItemReadyModule,
      "_waitForItemReady"
    ).and.callFake(() => Promise.resolve());
    const setItemAccessSpy = spyOn(portal, "setItemAccess").and.callFake(() =>
      Promise.resolve()
    );
    const shareItemWithGroupSpy = spyOn(
      portal,
      "shareItemWithGroup"
    ).and.callFake(() => Promise.resolve());

    const result = await createItemFromUrlOrFile({
      item,
      groups: [
        { id: "123", capabilities: ["updateitemcontrol"] } as unknown as IGroup,
        { id: "abc", capabilities: [] } as unknown as IGroup,
        { id: "456", capabilities: [] } as unknown as IGroup,
        { id: "def", capabilities: [] } as unknown as IGroup,
      ],
      ...ro,
    });

    expect(result).toEqual({ id: "123abc", success: true, folder: "test" });
    expect(createItemFromFileSpy).not.toHaveBeenCalled();
    expect(createItemFromUrlSpy).toHaveBeenCalledTimes(1);
    expect(_waitForItemReadySpy).toHaveBeenCalledTimes(1);
    expect(setItemAccessSpy).toHaveBeenCalledTimes(1);
    expect(shareItemWithGroupSpy).toHaveBeenCalledTimes(4);
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

    const createItemFromFileSpy = spyOn(
      createItemFromFileModule,
      "createItemFromFile"
    ).and.returnValue(
      Promise.resolve({ id: "123abc", success: true, folder: "test" })
    );
    const createItemFromUrlSpy = spyOn(
      createItemFromUrlModule,
      "createItemFromUrl"
    ).and.returnValue(
      Promise.resolve({ id: "123abc", success: true, folder: "test" })
    );
    const _waitForItemReadySpy = spyOn(
      _waitForItemReadyModule,
      "_waitForItemReady"
    ).and.callFake(() => Promise.resolve());
    const setItemAccessSpy = spyOn(portal, "setItemAccess").and.callFake(() =>
      Promise.resolve()
    );
    const shareItemWithGroupSpy = spyOn(
      portal,
      "shareItemWithGroup"
    ).and.callFake(() => Promise.resolve());

    const result = await createItemFromUrlOrFile({ item, groups: [], ...ro });

    expect(result).toEqual({ id: "123abc", success: true, folder: "test" });
    expect(createItemFromFileSpy).not.toHaveBeenCalled();
    expect(createItemFromUrlSpy).toHaveBeenCalledTimes(1);
    expect(_waitForItemReadySpy).not.toHaveBeenCalled();
    expect(setItemAccessSpy).toHaveBeenCalledTimes(1);
    expect(shareItemWithGroupSpy).not.toHaveBeenCalled();
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

    const createItemFromFileSpy = spyOn(
      createItemFromFileModule,
      "createItemFromFile"
    ).and.returnValue(
      Promise.resolve({ id: "123abc", success: true, folder: "test" })
    );
    const createItemFromUrlSpy = spyOn(
      createItemFromUrlModule,
      "createItemFromUrl"
    ).and.returnValue(
      Promise.resolve({ id: "123abc", success: true, folder: "test" })
    );
    const _waitForItemReadySpy = spyOn(
      _waitForItemReadyModule,
      "_waitForItemReady"
    ).and.callFake(() => Promise.resolve());
    const setItemAccessSpy = spyOn(portal, "setItemAccess").and.callFake(() =>
      Promise.resolve()
    );

    const result = await createItemFromUrlOrFile({ item, ...ro });

    expect(result).toEqual({ id: "123abc", success: true, folder: "test" });
    expect(createItemFromFileSpy).toHaveBeenCalledTimes(1);
    expect(createItemFromUrlSpy).not.toHaveBeenCalled();
    expect(_waitForItemReadySpy).toHaveBeenCalledTimes(1);
    expect(setItemAccessSpy).not.toHaveBeenCalled();
  });
});
