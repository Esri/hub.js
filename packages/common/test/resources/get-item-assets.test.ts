import * as portalModule from "@esri/arcgis-rest-portal";
import { IHubRequestOptions, getItemAssets } from "../../src";
import { cloneObject } from "../../src";
import { mockUserSession } from "../test-helpers/fake-user-session";

describe("getItemAssets", function() {
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
    type: "CSV"
  };

  const ro: IHubRequestOptions = {
    isPortal: false,
    hubApiUrl: "",
    portalSelf: {
      id: "",
      name: "",
      isPortal: true,
      portalHostname: "portal-hostname"
    },
    authentication: mockUserSession
  };

  it("gets the assets", async function() {
    const itemResourcesSpy = spyOn(
      portalModule,
      "getItemResources"
    ).and.returnValue(
      Promise.resolve({
        resources: [
          { resource: "foo" },
          { resource: "bar" },
          { resource: "baz" }
        ]
      })
    );

    const model = cloneObject(item);

    const assets = await getItemAssets(model, ro);

    expect(itemResourcesSpy.calls.count()).toBe(1, "fetched item resources");
    expect(itemResourcesSpy.calls.argsFor(0)).toEqual(
      ["abcitemid", ro],
      "called getItemResources with correct args"
    );
    expect(assets).toEqual(
      [
        {
          name: "thumbnail.png",
          url:
            "https://portal-hostname/sharing/rest/content/items/abcitemid/info/thumbnail.png",
          type: "thumbnail"
        },
        {
          name: "foo",
          type: "resource",
          url:
            "https://portal-hostname/sharing/rest/content/items/abcitemid/resources/foo"
        },
        {
          name: "bar",
          type: "resource",
          url:
            "https://portal-hostname/sharing/rest/content/items/abcitemid/resources/bar"
        },
        {
          name: "baz",
          type: "resource",
          url:
            "https://portal-hostname/sharing/rest/content/items/abcitemid/resources/baz"
        }
      ],
      "correctly generates asset records"
    );
  });

  it("ignores thumbnail when absent", async function() {
    const itemResourcesSpy = spyOn(
      portalModule,
      "getItemResources"
    ).and.returnValue(
      Promise.resolve({
        resources: [
          { resource: "foo" },
          { resource: "bar" },
          { resource: "baz" }
        ]
      })
    );

    const model = cloneObject(item);
    delete model.thumbnail;

    const assets = await getItemAssets(model, ro);

    expect(itemResourcesSpy.calls.count()).toBe(1, "fetched item resources");
    expect(itemResourcesSpy.calls.argsFor(0)).toEqual(
      ["abcitemid", ro],
      "called getItemResources with correct args"
    );
    expect(assets).toEqual(
      [
        {
          name: "foo",
          type: "resource",
          url:
            "https://portal-hostname/sharing/rest/content/items/abcitemid/resources/foo"
        },
        {
          name: "bar",
          type: "resource",
          url:
            "https://portal-hostname/sharing/rest/content/items/abcitemid/resources/bar"
        },
        {
          name: "baz",
          type: "resource",
          url:
            "https://portal-hostname/sharing/rest/content/items/abcitemid/resources/baz"
        }
      ],
      "No thumbnail asset is included"
    );
  });
});
