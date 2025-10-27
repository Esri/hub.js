import {
  describe,
  it,
  expect,
  afterEach,
  vi,
} from "vitest";
vi.mock("@esri/arcgis-rest-portal", async (importOriginal) => ({
  ...(await importOriginal()),
  getItemStatus: vi.fn(),
}));

import * as portal from "@esri/arcgis-rest-portal";
import type { IUserRequestOptions } from "@esri/arcgis-rest-request";
import { _waitForItemReady } from "../../src/items/_internal/_wait-for-item-ready";

afterEach(() => vi.restoreAllMocks());

describe("_waitForItemReady", () => {
  it("works for success", async () => {
    // auth
    const ro = {
      authentication: {
        portal: "http://some-org.mapsqaext.arcgis.com",
      },
    } as IUserRequestOptions;

    vi.spyOn(portal as any, "getItemStatus")
      .mockReturnValueOnce(Promise.resolve({ status: "partial" }))
      .mockReturnValueOnce(Promise.resolve({ status: "completed" }));

    await _waitForItemReady("1234abc", ro, 10);
    expect((portal as any).getItemStatus).toHaveBeenCalledTimes(2);
  });

  it("throws an error when an error occurs", async () => {
    // auth
    const ro = {
      authentication: {
        portal: "http://some-org.mapsqaext.arcgis.com",
      },
    } as IUserRequestOptions;

    vi.spyOn(portal as any, "getItemStatus")
      .mockReturnValueOnce(Promise.resolve({ status: "partial" }))
      .mockReturnValueOnce(
        Promise.resolve({ status: "failed", statusMessage: "Upload failed" })
      );

    try {
      await _waitForItemReady("1234abc", ro, 10);
      // should have thrown
      throw new Error("expected to throw");
    } catch (err) {
      const error = err as { message?: string };
      expect(error.message).toEqual("Upload failed");
    }
  });
});
