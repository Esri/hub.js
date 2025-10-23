import { vi } from "vitest";

vi.mock("@esri/arcgis-rest-portal", async (importOriginal) => ({
  ...(await importOriginal()),
  getItemResources: vi.fn(),
}));

import * as portalModule from "@esri/arcgis-rest-portal";
import { mockUserSession } from "../test-helpers/fake-user-session";
import { IHubRequestOptions } from "../../src/hub-types";
import { cloneObject } from "../../src/util";
import { getItemAssets } from "../../src/resources/get-item-assets";
import { vi } from "vitest";

describe("getItemAssets", () => {
  afterEach(() => vi.restoreAllMocks());

  const item: portalModule.IItem = {
    id: "abcitemid",
    thumbnail: "thumbnail.png",
    owner: "a",
    tags: ["x"],
    created: 1,
    modified: 1,
    numViews: 1,
    size: 1,
    title: "title",
    type: "CSV",
  };

  const ro: IHubRequestOptions = {
    isPortal: false,
    hubApiUrl: "",
    portalSelf: {
      id: "",
      name: "",
      isPortal: true,
      portalHostname: "portal-hostname",
    },
    authentication: mockUserSession,
  } as IHubRequestOptions;

  it("gets the assets", async () => {
    const itemResourcesSpy = vi
      .spyOn(portalModule, "getItemResources")
      .mockResolvedValue({
        resources: [
          { resource: "foo" },
          { resource: "bar" },
          { resource: "baz" },
        ],
      } as any);

    const model = cloneObject(item);

    const assets = await getItemAssets(model, ro);

    expect((itemResourcesSpy as any).mock.calls.length).toBe(1);
    expect((itemResourcesSpy as any).mock.calls[0]).toEqual(["abcitemid", ro]);
    expect(assets).toEqual([
      {
        name: "thumbnail.png",
        url: "https://portal-hostname/sharing/rest/content/items/abcitemid/info/thumbnail.png",
        type: "thumbnail",
      },
      {
        name: "foo",
        type: "resource",
        url: "https://portal-hostname/sharing/rest/content/items/abcitemid/resources/foo",
      },
      {
        name: "bar",
        type: "resource",
        url: "https://portal-hostname/sharing/rest/content/items/abcitemid/resources/bar",
      },
      {
        name: "baz",
        type: "resource",
        url: "https://portal-hostname/sharing/rest/content/items/abcitemid/resources/baz",
      },
    ]);
  });

  it("ignores thumbnail when absent", async () => {
    const itemResourcesSpy = vi
      .spyOn(portalModule, "getItemResources")
      .mockResolvedValue({
        resources: [
          { resource: "foo" },
          { resource: "bar" },
          { resource: "baz" },
        ],
      } as any);

    const model = cloneObject(item);
    delete model.thumbnail;

    const assets = await getItemAssets(model, ro);

    expect((itemResourcesSpy as any).mock.calls.length).toBe(1);
    expect((itemResourcesSpy as any).mock.calls[0]).toEqual(["abcitemid", ro]);
    expect(assets).toEqual([
      {
        name: "foo",
        type: "resource",
        url: "https://portal-hostname/sharing/rest/content/items/abcitemid/resources/foo",
      },
      {
        name: "bar",
        type: "resource",
        url: "https://portal-hostname/sharing/rest/content/items/abcitemid/resources/bar",
      },
      {
        name: "baz",
        type: "resource",
        url: "https://portal-hostname/sharing/rest/content/items/abcitemid/resources/baz",
      },
    ]);
  });
});
