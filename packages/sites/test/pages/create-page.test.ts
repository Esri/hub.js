import { createPage } from "../../src";
import {
  IHubRequestOptions,
  IModelTemplate,
  IItemResource,
  cloneObject
} from "@esri/hub-common";
import * as commonModule from "@esri/hub-common";
import * as portalModule from "@esri/arcgis-rest-portal";
import * as linkModule from "../../src/link-site-and-page";
import { expectAllCalled } from "../test-helpers.test";

describe("createPage", () => {
  const ro = ({
    authentication: {
      username: "tate",
      isPortal: false
    }
  } as unknown) as IHubRequestOptions;

  const pageModel = ({
    item: {
      typeKeywords: []
    },
    data: {
      values: {
        sites: [{ id: "site-1" }, { id: "site-2" }, { id: "site-3" }]
      }
    }
  } as unknown) as IModelTemplate;

  const opts = {
    shareTo: [{ id: "group-1", confirmItemControl: true }, { id: "group-2" }],
    assets: [{ url: "foobar-asset" } as IItemResource]
  };

  const itemId = "id-foo-bar";

  let createSpy: jasmine.Spy;
  let protectSpy: jasmine.Spy;
  let shareItemSpy: jasmine.Spy;
  let linkSpy: jasmine.Spy;
  let uploadResourcesSpy: jasmine.Spy;
  beforeEach(() => {
    createSpy = spyOn(portalModule, "createItem").and.returnValue(
      Promise.resolve({ id: itemId })
    );
    protectSpy = spyOn(portalModule, "protectItem").and.returnValue(
      Promise.resolve()
    );
    shareItemSpy = spyOn(portalModule, "shareItemWithGroup").and.returnValue(
      Promise.resolve()
    );
    linkSpy = spyOn(linkModule, "linkSiteAndPage").and.returnValue(
      Promise.resolve()
    );
    uploadResourcesSpy = spyOn(
      commonModule,
      "uploadResourcesFromUrl"
    ).and.returnValue(Promise.resolve());
  });

  it("throws if no authentication", async () => {
    const model = {} as IModelTemplate;
    const options = {};

    const roWithoutAuth = {} as IHubRequestOptions;
    expect(() => createPage(model, options, roWithoutAuth)).toThrowError();
  });

  it("creates a page", async () => {
    const created = await createPage(
      cloneObject(pageModel),
      cloneObject(opts),
      ro
    );

    expect(created.item.typeKeywords).toContain(
      "hubPage",
      "page type keyword should have been added (and other props ensured)"
    );

    expectAllCalled(
      [createSpy, protectSpy, shareItemSpy, linkSpy, uploadResourcesSpy],
      expect
    );

    // shareTo assertions
    expect(shareItemSpy).toHaveBeenCalledWith({
      id: itemId,
      groupId: "group-1",
      authentication: ro.authentication,
      confirmItemControl: true
    });

    expect(shareItemSpy).toHaveBeenCalledWith({
      id: itemId,
      groupId: "group-2",
      authentication: ro.authentication,
      confirmItemControl: false
    });

    expect(linkSpy.calls.count()).toBe(3);
    expect(linkSpy).toHaveBeenCalledWith(
      Object.assign(
        {
          siteId: "site-1",
          pageModel: created
        },
        ro
      )
    );
    expect(linkSpy).toHaveBeenCalledWith(
      Object.assign(
        {
          siteId: "site-2",
          pageModel: created
        },
        ro
      )
    );
    expect(linkSpy).toHaveBeenCalledWith(
      Object.assign(
        {
          siteId: "site-3",
          pageModel: created
        },
        ro
      )
    );

    expect(uploadResourcesSpy).toHaveBeenCalledWith(created, opts.assets, ro);
  });

  it("deals with no shareTo", async () => {
    const localOpts = cloneObject(opts);
    localOpts.shareTo = [];

    await createPage(cloneObject(pageModel), localOpts, ro);

    expectAllCalled(
      [createSpy, protectSpy, linkSpy, uploadResourcesSpy],
      expect
    );

    // shareTo assertions
    expect(shareItemSpy).not.toHaveBeenCalled();
  });

  it("rejects if something blows up", async () => {
    createSpy.and.returnValue(Promise.reject());

    try {
      await createPage(cloneObject(pageModel), opts, ro);
      fail("should reject");
    } catch (err) {
      expect(err).toBeDefined();
    }
  });
});
