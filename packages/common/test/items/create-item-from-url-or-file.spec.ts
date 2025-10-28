import type { IUserRequestOptions } from "@esri/arcgis-rest-request";
import type { IGroup, IItemAdd } from "@esri/arcgis-rest-portal";
import { createItemFromUrlOrFile } from "../../src/items/create-item-from-url-or-file";
import * as createItemFromFileModule from "../../src/items/create-item-from-file";
import * as createItemFromUrlModule from "../../src/items/create-item-from-url";
import * as _waitForItemReadyModule from "../../src/items/_internal/_wait-for-item-ready";
// make portal spyable
vi.mock("@esri/arcgis-rest-portal", async (importOriginal: any) => {
  const mod = await importOriginal();
  return Object.assign({}, mod, {
    setItemAccess: vi.fn(),
    shareItemWithGroup: vi.fn(),
  });
});
import * as portal from "@esri/arcgis-rest-portal";
import { afterEach, describe, expect, it, vi } from "vitest";

describe("createItemFromUrlOrFile", () => {
  afterEach(() => vi.restoreAllMocks());
  it("creates an item from url", async () => {
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
      access: "org",
    } as IItemAdd;

    const createItemFromFileSpy = vi
      .spyOn(createItemFromFileModule as any, "createItemFromFile")
      .mockResolvedValue({ id: "123abc", success: true, folder: "test" });
    const createItemFromUrlSpy = vi
      .spyOn(createItemFromUrlModule as any, "createItemFromUrl")
      .mockResolvedValue({ id: "123abc", success: true, folder: "test" });
    const _waitForItemReadySpy = vi
      .spyOn(_waitForItemReadyModule as any, "_waitForItemReady")
      .mockResolvedValue(undefined);
    const setItemAccessSpy = vi
      .spyOn(portal as any, "setItemAccess")
      .mockResolvedValue(undefined as any);
    const shareItemWithGroupSpy = vi
      .spyOn(portal as any, "shareItemWithGroup")
      .mockResolvedValue({} as any);

    const result = await createItemFromUrlOrFile({
      item,
      groups: [
        { id: "123", capabilities: ["updateitemcontrol"] } as unknown as IGroup,
        { id: "abc", capabilities: [] } as unknown as IGroup,
        { id: "456", capabilities: [] } as unknown as IGroup,
        { id: "def", capabilities: [] } as unknown as IGroup,
      ],
      ...ro,
    } as any);

    expect(result.title).toBe("Test.csv");
    expect(result.createdItem).toEqual({
      id: "123abc",
      success: true,
      folder: "test",
    });
    expect(createItemFromFileSpy).not.toHaveBeenCalled();
    expect(createItemFromUrlSpy).toHaveBeenCalledTimes(1);
    expect(_waitForItemReadySpy).toHaveBeenCalledTimes(1);
    expect(setItemAccessSpy).toHaveBeenCalledTimes(1);
    expect(shareItemWithGroupSpy).toHaveBeenCalledTimes(4);
  });

  it("creates an item from url without dataUrl", async () => {
    const ro = {
      authentication: {
        portal: "http://some-org.mapsqaext.arcgis.com",
      },
    } as IUserRequestOptions;
    const item = {
      title: "Test.csv",
      type: "csv",
      owner: "test",
      text: "This is a test",
      async: false,
      access: "org",
    } as IItemAdd;

    const createItemFromFileSpy = vi
      .spyOn(createItemFromFileModule as any, "createItemFromFile")
      .mockResolvedValue({ id: "123abc", success: true, folder: "test" });
    const createItemFromUrlSpy = vi
      .spyOn(createItemFromUrlModule as any, "createItemFromUrl")
      .mockResolvedValue({ id: "123abc", success: true, folder: "test" });
    const _waitForItemReadySpy = vi
      .spyOn(_waitForItemReadyModule as any, "_waitForItemReady")
      .mockResolvedValue(undefined);
    const setItemAccessSpy = vi
      .spyOn(portal as any, "setItemAccess")
      .mockResolvedValue(undefined as any);
    const shareItemWithGroupSpy = vi
      .spyOn(portal as any, "shareItemWithGroup")
      .mockResolvedValue(undefined as any);

    const result = await createItemFromUrlOrFile({
      item,
      groups: [],
      ...ro,
    } as any);

    expect(result.createdItem).toEqual({
      id: "123abc",
      success: true,
      folder: "test",
    });
    expect(createItemFromFileSpy).not.toHaveBeenCalled();
    expect(createItemFromUrlSpy).toHaveBeenCalledTimes(1);
    expect(_waitForItemReadySpy).not.toHaveBeenCalled();
    expect(setItemAccessSpy).toHaveBeenCalledTimes(1);
    expect(shareItemWithGroupSpy).not.toHaveBeenCalled();
  });

  it("creates an item from file", async () => {
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
      access: "private",
    } as IItemAdd;

    const createItemFromFileSpy = vi
      .spyOn(createItemFromFileModule as any, "createItemFromFile")
      .mockResolvedValue({ id: "123abc", success: true, folder: "test" });
    const createItemFromUrlSpy = vi
      .spyOn(createItemFromUrlModule as any, "createItemFromUrl")
      .mockResolvedValue({ id: "123abc", success: true, folder: "test" });
    const _waitForItemReadySpy = vi
      .spyOn(_waitForItemReadyModule as any, "_waitForItemReady")
      .mockResolvedValue(undefined);
    const setItemAccessSpy = vi
      .spyOn(portal as any, "setItemAccess")
      .mockResolvedValue(undefined as any);

    const result = await createItemFromUrlOrFile({ item, ...ro } as any);

    expect(result.createdItem).toEqual({
      id: "123abc",
      success: true,
      folder: "test",
    });
    expect(createItemFromFileSpy).toHaveBeenCalledTimes(1);
    expect(createItemFromUrlSpy).not.toHaveBeenCalled();
    expect(_waitForItemReadySpy).toHaveBeenCalledTimes(1);
    expect(setItemAccessSpy).not.toHaveBeenCalled();
  });
});
