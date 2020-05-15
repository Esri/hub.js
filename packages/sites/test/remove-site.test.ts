import { removeSite } from "../src";
import * as commonModule from "@esri/hub-common";
import * as unlinkPagesModule from "../src/unlink-pages-from-site";
import * as removeGroupsModule from "../src/_remove-site-groups";
import * as removeInitModule from "../src/_remove-parent-initiative";
import * as removeDomainsModule from "../src/_remove-site-domains";
import * as removeIndexModule from "../src/_remove-site-from-index";
import { IModel, IHubRequestOptions } from "@esri/hub-common";

function expectAllCalled(spys: jasmine.Spy[], expect: any) {
  spys.forEach(spy => expect(spy).toHaveBeenCalled());
}

describe("removeSite", () => {
  const siteModelFromApi = {
    item: {
      id: "id-from-api",
      owner: "owner-from-api"
    }
  } as IModel;

  let getModelSpy: jasmine.Spy;
  let unlinkSpy: jasmine.Spy;
  let unprotectSpy: jasmine.Spy;
  let removeSiteSpy: jasmine.Spy;
  let removeInitSpy: jasmine.Spy;
  let removeDomainsSpy: jasmine.Spy;
  let removeIndexSpy: jasmine.Spy;

  beforeEach(() => {
    getModelSpy = spyOn(commonModule, "getModel").and.returnValue(
      Promise.resolve(siteModelFromApi)
    );
    unlinkSpy = spyOn(unlinkPagesModule, "unlinkPagesFromSite").and.returnValue(
      Promise.resolve()
    );
    unprotectSpy = spyOn(
      commonModule,
      "_unprotectAndRemoveItem"
    ).and.returnValue(Promise.resolve());
    removeSiteSpy = spyOn(
      removeGroupsModule,
      "_removeSiteGroups"
    ).and.returnValue(Promise.resolve());
    removeInitSpy = spyOn(
      removeInitModule,
      "_removeParentInitiative"
    ).and.returnValue(Promise.resolve());
    removeDomainsSpy = spyOn(
      removeDomainsModule,
      "_removeSiteDomains"
    ).and.returnValue(Promise.resolve());
    removeIndexSpy = spyOn(
      removeIndexModule,
      "_removeSiteFromIndex"
    ).and.returnValue(Promise.resolve());
  });

  it("removes a site when given a model", async () => {
    const model = {
      item: {
        id: "some-id",
        owner: "some-owner"
      }
    } as IModel;

    await removeSite(model, {} as IHubRequestOptions);

    expectAllCalled(
      [
        unlinkSpy,
        unprotectSpy,
        removeSiteSpy,
        removeInitSpy,
        removeDomainsSpy,
        removeIndexSpy
      ],
      expect
    );

    expect(getModelSpy).not.toHaveBeenCalled();

    expect(unlinkSpy.calls.argsFor(0)[0].item.id).toBe("some-id");
  });

  it("removes a site when given an id", async () => {
    const id = "some-id";

    await removeSite(id, {} as IHubRequestOptions);

    expect(getModelSpy).toHaveBeenCalled();

    expectAllCalled(
      [
        unlinkSpy,
        unprotectSpy,
        removeSiteSpy,
        removeInitSpy,
        removeDomainsSpy,
        removeIndexSpy
      ],
      expect
    );

    expect(unlinkSpy.calls.argsFor(0)[0].item.id).toBe("id-from-api");
  });

  it("rejects if something fails", async () => {
    const id = "some-id";

    unlinkSpy.and.returnValue(Promise.reject());

    try {
      await removeSite(id, {} as IHubRequestOptions);
      fail("should reject");
    } catch (err) {
      expect(err).toBeDefined();
    }
  });
});
