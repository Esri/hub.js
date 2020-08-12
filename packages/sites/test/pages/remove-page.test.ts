import { removePage } from "../../src";
import * as commonModule from "@esri/hub-common";
import * as portalModule from "@esri/arcgis-rest-portal";
import * as unlinkSiteAndPageModule from "../../src/unlink-site-and-page";

import { IModel, IHubRequestOptions } from "@esri/hub-common";

function expectAllCalled(spys: jasmine.Spy[], expect: any) {
  spys.forEach(spy => expect(spy).toHaveBeenCalled());
}

describe("removeSite", () => {
  const pageModelFromApi = {
    item: {
      id: "id-from-api",
      owner: "owner-from-api"
    }
  } as IModel;

  let getModelSpy: jasmine.Spy;
  let unlinkSpy: jasmine.Spy;
  let unprotectSpy: jasmine.Spy;
  let removeSpy: jasmine.Spy;

  beforeEach(() => {
    getModelSpy = spyOn(commonModule, "getModel").and.returnValue(
      Promise.resolve(pageModelFromApi)
    );
    unlinkSpy = spyOn(
      unlinkSiteAndPageModule,
      "unlinkSiteAndPage"
    ).and.returnValue(Promise.resolve());
    unprotectSpy = spyOn(commonModule, "unprotectModel").and.returnValue(
      Promise.resolve()
    );
    removeSpy = spyOn(portalModule, "removeItem").and.returnValue(
      Promise.resolve()
    );
  });

  it("removes a site when given a model", async () => {
    const model = ({
      item: {
        id: "some-id",
        owner: "some-owner"
      },
      data: {
        values: {
          sites: [{ id: "foo-site" }, { id: "bar-site" }, { id: "baz-site" }]
        }
      }
    } as unknown) as IModel;

    await removePage(model, ({
      propFromRO: "foo"
    } as unknown) as IHubRequestOptions);

    expectAllCalled([unlinkSpy, unprotectSpy, removeSpy], expect);

    expect(getModelSpy).not.toHaveBeenCalled();

    expect(unlinkSpy).toHaveBeenCalledWith({
      siteId: "foo-site",
      propFromRO: "foo",
      pageModel: model
    });
    expect(unlinkSpy).toHaveBeenCalledWith({
      siteId: "baz-site",
      propFromRO: "foo",
      pageModel: model
    });
    expect(unlinkSpy).toHaveBeenCalledWith({
      siteId: "bar-site",
      propFromRO: "foo",
      pageModel: model
    });

    expect(removeSpy.calls.argsFor(0)[0].id).toBe("some-id");
  });

  it("removes a site when given an id", async () => {
    const id = "some-id";

    await removePage(id, ({
      propFromRO: "foo"
    } as unknown) as IHubRequestOptions);

    expect(getModelSpy).toHaveBeenCalled();

    expectAllCalled([getModelSpy, unprotectSpy, removeSpy], expect);

    expect(unlinkSpy).not.toHaveBeenCalled(); // no sites, so shouldnt call
    expect(removeSpy.calls.argsFor(0)[0].id).toBe("id-from-api");
  });

  it("succeeds even if unlinking fails", async () => {
    const model = ({
      item: {
        id: "some-id",
        owner: "some-owner"
      },
      data: {
        values: {
          sites: [{ id: "foo-site" }, { id: "bar-site" }, { id: "baz-site" }]
        }
      }
    } as unknown) as IModel;

    unlinkSpy.and.returnValue(Promise.reject());

    try {
      await removePage(model, {} as IHubRequestOptions);
    } catch (err) {
      fail("shouldnt reject!");
    }
  });

  it("rejects if something critical fails", async () => {
    const id = "some-id";

    unprotectSpy.and.returnValue(Promise.reject(Error("rejected!")));

    try {
      await removePage(id, {} as IHubRequestOptions);
      fail("should reject");
    } catch (err) {
      expect(err).toBeDefined();
    }
  });
});
