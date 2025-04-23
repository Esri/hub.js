import { linkSiteAndPage } from "../src";
import * as commonModule from "@esri/hub-common";
import * as fetchMock from "fetch-mock";
import { cloneObject } from "@esri/hub-common";

function resetSpys(...args: jasmine.Spy[]) {
  args.forEach((spy) => spy.calls.reset());
}

describe("linkSiteAndPage", () => {
  const siteModel = {
    item: {
      id: "bazsite",
      type: "Hub Site Application",
      typeKeywords: [],
      properties: {
        collaborationGroupId: "collab-id",
        contentGroupId: "content-id",
      },
    },
    data: {
      values: {
        pages: [{ id: "foopage" }, { id: "bazpage" }],
      },
    },
  } as unknown as commonModule.IModel;

  const pageModel = {
    item: {
      id: "barpage",
      type: "Hub Page",
    },
    data: {
      values: {
        sites: [{ id: "foosite" }, { id: "barsite" }],
      },
    },
  } as unknown as commonModule.IModel;

  let shareSpy: jasmine.Spy;
  let updateSpy: jasmine.Spy;

  beforeEach(() => {
    shareSpy = spyOn(commonModule, "shareItemToGroups").and.returnValue(
      Promise.resolve({})
    );

    updateSpy = spyOn(commonModule, "updateItem").and.callFake((opts: any) =>
      Promise.resolve({ success: true, id: opts.item.id })
    );
  });

  it("links site and page", async () => {
    await linkSiteAndPage({
      siteModel: cloneObject(siteModel),
      pageModel: cloneObject(pageModel),
      authentication: {} as any,
    });

    expect(updateSpy).toHaveBeenCalledTimes(2);

    // this is a janky dance, but check serializeModel for why we do this
    const serializedPage = updateSpy.calls.argsFor(0)[0].item;
    const updatePageModel = {
      item: serializedPage,
      data: JSON.parse(serializedPage.text),
    };
    expect(updatePageModel.data.values.sites).toContain({ id: "bazsite" });

    const serializedSite = updateSpy.calls.argsFor(1)[0].item;
    const updateSiteModel = {
      item: serializedSite,
      data: JSON.parse(serializedSite.text),
    };
    expect(updateSiteModel.data.values.pages.map((p: any) => p.id)).toContain(
      "barpage"
    );

    // unshared page with core team and content group
    expect(shareSpy).toHaveBeenCalledWith(
      pageModel.item.id,
      ["collab-id", "content-id"],
      { authentication: {} }
    );
  });

  it("allows linking old site items", async () => {
    // make an old site
    const oldSite = commonModule.cloneObject(siteModel);
    oldSite.item.type = "Web Mapping Application";
    oldSite.item.typeKeywords.push("hubSite");

    await linkSiteAndPage({
      siteModel: oldSite,
      pageModel: cloneObject(pageModel),
      authentication: {} as any,
    });

    expect(updateSpy).toHaveBeenCalledTimes(2);
    expect(shareSpy).toHaveBeenCalled();
  });

  it("doesnt blow up if arrays not present", async () => {
    const [page, site] = [pageModel, siteModel].map((m: any) =>
      commonModule.cloneObject(m)
    );

    delete page.data.values.sites;
    delete site.data.values.pages;

    await linkSiteAndPage({
      siteModel: site,
      pageModel: page,
      authentication: {} as any,
    });

    expect(updateSpy).toHaveBeenCalledTimes(2);
    // unshared page with core team and content group
    expect(shareSpy).toHaveBeenCalledWith(
      pageModel.item.id,
      ["collab-id", "content-id"],
      { authentication: {} }
    );
  });

  it("skips updates if already linked", async () => {
    // manually link
    const [page, site] = [pageModel, siteModel].map((m: any) =>
      commonModule.cloneObject(m)
    );
    page.data.values.sites.push({ id: "bazsite" });
    site.data.values.pages.push({ id: "barpage" });

    await linkSiteAndPage({
      siteModel: site,
      pageModel: page,
      authentication: {} as any,
    });

    expect(updateSpy).not.toHaveBeenCalled();
    // should still do sharing call
    expect(shareSpy).toHaveBeenCalledWith(
      pageModel.item.id,
      ["collab-id", "content-id"],
      { authentication: {} }
    );
  });

  it("rejects if one or both are non-existant", async () => {
    fetchMock.mock("*", 404); // make all model requests fail

    const fakeSession = {
      getToken: () => Promise.resolve("token"),
    } as unknown as any;

    // Non-existant site
    try {
      await linkSiteAndPage({
        siteId: "no-exist",
        pageModel: cloneObject(pageModel),
        authentication: fakeSession,
      });
      fail("should reject");
    } catch (err) {
      expect(err.message).toContain("Site");
    }
    expect(updateSpy).not.toHaveBeenCalled();
    expect(shareSpy).not.toHaveBeenCalled();

    // Non-existant page
    resetSpys(shareSpy, updateSpy);
    try {
      await linkSiteAndPage({
        siteModel: cloneObject(siteModel),
        pageId: "no-exist",
        authentication: fakeSession,
      });
      fail("should reject");
    } catch (err) {
      expect(err.message).toContain("Page");
    }
    expect(updateSpy).not.toHaveBeenCalled();
    expect(shareSpy).not.toHaveBeenCalled();

    // Non-existant site and page
    resetSpys(shareSpy, updateSpy);
    try {
      await linkSiteAndPage({
        siteId: "no-exist",
        pageId: "no-exist",
        authentication: fakeSession,
      });
      fail("should reject");
    } catch (err) {
      expect(err.message).toContain("Both");
    }
    expect(updateSpy).not.toHaveBeenCalled();
    expect(shareSpy).not.toHaveBeenCalled();
  });

  it("does nothing if one or both are wrong item type", async () => {
    // manually link
    const notPage = commonModule.cloneObject(pageModel);
    notPage.item.type = "Not a Page";

    await linkSiteAndPage({
      siteModel: cloneObject(siteModel),
      pageModel: notPage,
      authentication: {} as any,
    });

    expect(updateSpy).not.toHaveBeenCalled();
    expect(shareSpy).not.toHaveBeenCalled();
  });
});
