import { unlinkSiteAndPage } from "../src";
import * as commonModule from "@esri/hub-common";
import * as fetchMock from "fetch-mock";
import { UserSession } from "@esri/arcgis-rest-auth";

function resetSpys(...args: jasmine.Spy[]) {
  args.forEach(spy => spy.calls.reset());
}

describe("unlinkSiteAndPage", () => {
  const siteModel = ({
    item: {
      id: "bazsite",
      properties: {
        collaborationGroupId: "collab-id",
        contentGroupId: "content-id"
      }
    },
    data: {
      values: {
        pages: [{ id: "foopage" }, { id: "barpage" }, { id: "bazpage" }]
      }
    }
  } as unknown) as commonModule.IModel;

  const pageModel = ({
    item: {
      id: "barpage"
    },
    data: {
      values: {
        sites: [{ id: "foosite" }, { id: "barsite" }, { id: "bazsite" }]
      }
    }
  } as unknown) as commonModule.IModel;

  it("removes site and page from corresponding item arrays and unshares site with site groups", async () => {
    const updateSpy = spyOn(commonModule, "failSafeUpdate").and.callFake(
      (model: commonModule.IModel) => Promise.resolve(model)
    );

    const unshareSpy = spyOn(
      commonModule,
      "unshareItemFromGroups"
    ).and.returnValue(Promise.resolve({}));

    await unlinkSiteAndPage({
      siteModel,
      pageModel,
      authentication: {} as UserSession
    });

    expect(updateSpy).toHaveBeenCalledTimes(2);

    const updateSiteArg = updateSpy.calls.argsFor(0)[0];
    expect(updateSiteArg.data.values.pages).not.toContain({ id: "barpage" });
    const updatePageArg = updateSpy.calls.argsFor(1)[0];
    expect(updatePageArg.data.values.sites).not.toContain({ id: "bazsite" });

    // unshared page with core team and content group
    expect(unshareSpy).toHaveBeenCalledWith(
      pageModel.item.id,
      ["collab-id", "content-id"],
      { authentication: {} }
    );
  });

  it("skips logic when site and/or page dont exist", async () => {
    fetchMock.mock("*", 404); // make all model requests fail

    const updateSpy = spyOn(commonModule, "failSafeUpdate").and.callFake(
      (model: commonModule.IModel) => Promise.resolve(model)
    );

    const unshareSpy = spyOn(
      commonModule,
      "unshareItemFromGroups"
    ).and.returnValue(Promise.resolve({}));

    const fakeSession = ({
      getToken: () => Promise.resolve("token")
    } as unknown) as UserSession;

    // Non-existant site
    await unlinkSiteAndPage({
      siteId: "no-exist",
      pageModel,
      authentication: fakeSession
    });
    expect(updateSpy).toHaveBeenCalledTimes(1);
    expect(unshareSpy.calls.argsFor(0)[1]).toEqual(
      [],
      "not unshared from any groups"
    );

    // Non-existant page
    resetSpys(unshareSpy, updateSpy);
    await unlinkSiteAndPage({
      siteModel,
      pageId: "no-exist",
      authentication: fakeSession
    });
    expect(updateSpy).toHaveBeenCalledTimes(1);
    expect(unshareSpy).not.toHaveBeenCalled();

    // Non-existant site and page
    resetSpys(unshareSpy, updateSpy);
    await unlinkSiteAndPage({
      siteId: "no-exist",
      pageId: "no-exist",
      authentication: fakeSession
    });
    expect(updateSpy).not.toHaveBeenCalled();
    expect(unshareSpy).not.toHaveBeenCalled();
  });
});
