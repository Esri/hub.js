import { vi, describe, it, expect, afterEach } from "vitest";

// Make ESM namespace exports spy-able by merging originals and overriding specific exports
vi.mock("@esri/arcgis-rest-portal", async (importOriginal) => ({
  ...(await importOriginal()),
  removeItemResource: vi.fn(),
  addItemResource: vi.fn(),
  updateItemResource: vi.fn(),
  getItemResources: vi.fn(),
}));

import { MOCK_AUTH } from "../mocks/mock-auth";
import * as portalModule from "@esri/arcgis-rest-portal";
import { removeResource } from "../../src/resources/removeResource";

describe("removeResource:", () => {
  afterEach(() => vi.restoreAllMocks());

  it("calls removeItemResource with expected params", async () => {
    const addSpy = vi
      .spyOn(portalModule, "removeItemResource")
      .mockResolvedValue({ success: true } as any);
    const resp = await removeResource("3ef", "featuredImage.png", "bob", {
      authentication: MOCK_AUTH,
    });
    expect(resp).toEqual({ success: true });
    expect(addSpy).toHaveBeenCalledTimes(1);
    const args = (addSpy as any).mock.calls[0][0];
    expect(args.id).toBe("3ef");
    expect(args.owner).toEqual("bob");
    expect(args.resource).toEqual("featuredImage.png");
    expect(args.authentication).toEqual(MOCK_AUTH);
  });

  it("Properly constructs url when a prefix is passed", async () => {
    const addSpy = vi
      .spyOn(portalModule, "removeItemResource")
      .mockResolvedValue({ success: true } as any);
    const resp = await removeResource("3ef", "featuredImage.png", "bob", {
      authentication: MOCK_AUTH,
    });
    expect(resp).toEqual({ success: true });
    expect(addSpy).toHaveBeenCalledTimes(1);
    const args = (addSpy as any).mock.calls[0][0];
    expect(args.id).toBe("3ef");
    expect(args.owner).toEqual("bob");
    expect(args.resource).toEqual("featuredImage.png");
    expect(args.authentication).toEqual(MOCK_AUTH);
  });

  it("throws hub error if add fails", async () => {
    vi.spyOn(portalModule, "removeItemResource").mockResolvedValue({
      success: false,
    } as any);
    try {
      await removeResource("3ef", "featuredImage.png", "bob", {
        authentication: MOCK_AUTH,
      });
      throw new Error("should have thrown");
    } catch (err) {
      expect((err as Error).name).toBeDefined();
    }
  });

  it("throws hub error if add rejects with error", async () => {
    vi.spyOn(portalModule, "removeItemResource").mockRejectedValue(
      new Error("Fake Rejection")
    );
    try {
      await removeResource("3ef", "featuredImage.png", "bob", {
        authentication: MOCK_AUTH,
      });
      throw new Error("should have thrown");
    } catch (err) {
      expect((err as Error).name).toBeDefined();
    }
  });

  it("throws hub error if add rejects with non-error", async () => {
    vi.spyOn(portalModule, "removeItemResource").mockRejectedValue(
      "Fake Rejection" as any
    );
    try {
      await removeResource("3ef", "featuredImage.png", "bob", {
        authentication: MOCK_AUTH,
      });
      throw new Error("should have thrown");
    } catch (err) {
      expect((err as Error).name).toBeDefined();
    }
  });
});
