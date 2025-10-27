import { vi, describe, it, expect, afterEach } from "vitest";

vi.mock("@esri/arcgis-rest-portal", async (importOriginal) => ({
  ...(await importOriginal()),
  addItemResource: vi.fn(),
  updateItemResource: vi.fn(),
  getItemResources: vi.fn(),
}));

import { MOCK_AUTH } from "../mocks/mock-auth";
import * as portalModule from "@esri/arcgis-rest-portal";
import { upsertResource } from "../../src/resources/upsertResource";

describe("createResource:", () => {
  afterEach(() => vi.restoreAllMocks());

  it("calls addItemResource with expected params", async () => {
    const addSpy = vi
      .spyOn(portalModule, "addItemResource")
      .mockResolvedValue({ success: true } as any);
    const getResourcesSpy = vi
      .spyOn(portalModule, "getItemResources")
      .mockResolvedValue({ resources: [] } as any);
    const resp = await upsertResource(
      "3ef",
      "bob",
      "fakeFile",
      "featuredImage.png",
      { authentication: MOCK_AUTH }
    );
    expect(resp).toEqual(
      "https://www.arcgis.com/sharing/rest/content/items/3ef/resources/featuredImage.png"
    );
    expect(getResourcesSpy).toHaveBeenCalledTimes(1);
    expect(addSpy).toHaveBeenCalledTimes(1);
    const args = (addSpy as any).mock.calls[0][0];
    expect(args.id).toBe("3ef");
    expect(args.owner).toEqual("bob");
    expect(args.resource).toEqual("fakeFile");
    expect(args.name).toEqual("featuredImage.png");
    expect(args.authentication).toEqual(MOCK_AUTH);
  });

  it("calls updateItemResource with expected params", async () => {
    const updateSpy = vi
      .spyOn(portalModule, "updateItemResource")
      .mockResolvedValue({ success: true } as any);
    const getResourcesSpy = vi
      .spyOn(portalModule, "getItemResources")
      .mockResolvedValue({
        resources: [
          { resource: "featuredImage.png" },
          { resource: "test.txt" },
        ],
      } as any);
    const resp = await upsertResource(
      "3ef",
      "bob",
      "fakeFile",
      "featuredImage.png",
      { authentication: MOCK_AUTH }
    );
    expect(resp).toEqual(
      "https://www.arcgis.com/sharing/rest/content/items/3ef/resources/featuredImage.png"
    );
    expect(getResourcesSpy).toHaveBeenCalledTimes(1);
    expect(updateSpy).toHaveBeenCalledTimes(1);
    const args = (updateSpy as any).mock.calls[0][0];
    expect(args.id).toBe("3ef");
    expect(args.owner).toEqual("bob");
    expect(args.resource).toEqual("fakeFile");
    expect(args.name).toEqual("featuredImage.png");
    expect(args.authentication).toEqual(MOCK_AUTH);
  });

  it("Properly constructs url when a prefix is passed", async () => {
    const addSpy = vi
      .spyOn(portalModule, "addItemResource")
      .mockResolvedValue({ success: true } as any);
    const getResourcesSpy = vi
      .spyOn(portalModule, "getItemResources")
      .mockResolvedValue({ resources: [] } as any);
    const resp = await upsertResource(
      "3ef",
      "bob",
      "fakeFile",
      "featuredImage.png",
      { authentication: MOCK_AUTH },
      "images"
    );
    expect(resp).toEqual(
      "https://www.arcgis.com/sharing/rest/content/items/3ef/resources/images/featuredImage.png"
    );
    expect(getResourcesSpy).toHaveBeenCalledTimes(1);
    expect(addSpy).toHaveBeenCalledTimes(1);
    const args = (addSpy as any).mock.calls[0][0];
    expect(args.id).toBe("3ef");
    expect(args.owner).toEqual("bob");
    expect(args.resource).toEqual("fakeFile");
    expect(args.name).toEqual("featuredImage.png");
    expect(args.authentication).toEqual(MOCK_AUTH);
    expect(args.prefix).toEqual("images");
  });

  it("Properly converts json to blob", async () => {
    try {
      const addSpy = vi
        .spyOn(portalModule, "addItemResource")
        .mockResolvedValue({ success: true } as any);
      const getResourcesSpy = vi
        .spyOn(portalModule, "getItemResources")
        .mockResolvedValue({ resources: [] } as any);
      const resp = await upsertResource(
        "3ef",
        "bob",
        { foo: "bar" },
        "location.json",
        { authentication: MOCK_AUTH }
      );
      expect(resp).toEqual(
        "https://www.arcgis.com/sharing/rest/content/items/3ef/resources/location.json"
      );
      expect(getResourcesSpy).toHaveBeenCalledTimes(1);
      expect(addSpy).toHaveBeenCalledTimes(1);
      const args = (addSpy as any).mock.calls[0][0];
      expect(args.id).toBe("3ef");
      expect(args.owner).toEqual("bob");
      expect(args.resource).toEqual(
        new Blob(['{"foo":"bar"}'], { type: "application/json" })
      );
      expect(args.name).toEqual("location.json");
      expect(args.authentication).toEqual(MOCK_AUTH);
    } catch (ex) {
      if (typeof Blob === "undefined") {
        expect((ex as Error).message).toEqual(
          "objectToJsonBlob is not currently supported on Node"
        );
      }
    }
  });

  it("Properly converts text to blob", async () => {
    try {
      const addSpy = vi
        .spyOn(portalModule, "addItemResource")
        .mockResolvedValue({ success: true } as any);
      const getResourcesSpy = vi
        .spyOn(portalModule, "getItemResources")
        .mockResolvedValue({ resources: [] } as any);
      const resp = await upsertResource(
        "3ef",
        "bob",
        "some text",
        "location.txt",
        { authentication: MOCK_AUTH }
      );
      expect(resp).toEqual(
        "https://www.arcgis.com/sharing/rest/content/items/3ef/resources/location.txt"
      );
      expect(getResourcesSpy).toHaveBeenCalledTimes(1);
      expect(addSpy).toHaveBeenCalledTimes(1);
      const args = (addSpy as any).mock.calls[0][0];
      expect(args.id).toBe("3ef");
      expect(args.owner).toEqual("bob");
      expect(args.resource).toEqual(
        new Blob(["some text"], { type: "text/plain" })
      );
      expect(args.name).toEqual("location.txt");
      expect(args.authentication).toEqual(MOCK_AUTH);
    } catch (ex) {
      if (typeof Blob === "undefined") {
        expect((ex as Error).message).toEqual(
          "stringToBlob is not currently supported on Node"
        );
      }
    }
  });

  it("throws hub error if add fails", async () => {
    vi.spyOn(portalModule, "addItemResource").mockResolvedValue({
      success: false,
    } as any);
    vi.spyOn(portalModule, "getItemResources").mockResolvedValue({
      resources: [],
    } as any);
    try {
      await upsertResource("3ef", "bob", "fakeFile", "featuredImage.png", {
        authentication: MOCK_AUTH,
      });
      throw new Error("should have thrown");
    } catch (err) {
      expect((err as Error).name).toBe("HubError");
    }
  });

  it("throws hub error if add rejects with error", async () => {
    vi.spyOn(portalModule, "addItemResource").mockRejectedValue(
      new Error("Fake Rejection")
    );
    vi.spyOn(portalModule, "getItemResources").mockResolvedValue({
      resources: [],
    } as any);
    try {
      await upsertResource("3ef", "bob", "fakeFile", "featuredImage.png", {
        authentication: MOCK_AUTH,
      });
      throw new Error("should have thrown");
    } catch (err) {
      expect((err as Error).name).toBe("HubError");
    }
  });

  it("throws hub error if add rejects with non-error", async () => {
    vi.spyOn(portalModule, "addItemResource").mockRejectedValue(
      "Fake Rejection" as any
    );
    vi.spyOn(portalModule, "getItemResources").mockResolvedValue({
      resources: [],
    } as any);
    try {
      await upsertResource("3ef", "bob", "fakeFile", "featuredImage.png", {
        authentication: MOCK_AUTH,
      });
      throw new Error("should have thrown");
    } catch (err) {
      expect((err as Error).name).toBe("HubError");
    }
  });
});
