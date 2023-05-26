import { updateSiteApplicationUris } from "../src";
import * as updateRedirectModule from "../src/update-app-redirect-uris";
import * as commonModule from "@esri/hub-common";
import { IModel, IHubRequestOptions } from "@esri/hub-common";

describe("updateSiteApplicationUris", () => {
  const site = {
    item: {
      id: "site-id",
      title: "site-title",
    },
    data: {
      values: {
        clientId: "client-id",
      },
    },
  } as unknown as IModel;

  const ro = {
    portalSelf: {
      urlKey: "key",
      id: "org-id",
      name: "org-name",
    },
  } as unknown as IHubRequestOptions;

  let removeSpy: jasmine.Spy;
  let addSpy: jasmine.Spy;
  let getDomainsSpy: jasmine.Spy;
  beforeEach(() => {
    getDomainsSpy = spyOn(commonModule, "getDomainsForSite").and.returnValue(
      Promise.resolve([
        { id: "foo-id", hostname: "foo", sslOnly: false },
        { id: "baz-id", hostname: "baz", sslOnly: false },
      ])
    );

    removeSpy = spyOn(commonModule, "removeDomain").and.returnValue(
      Promise.resolve({})
    );

    addSpy = spyOn(commonModule, "addDomain").and.returnValue(
      Promise.resolve({})
    );
  });

  it("updates the site application uris", async () => {
    const uris = ["foo", "bar"];

    await updateSiteApplicationUris(site, uris, ro);

    expect(getDomainsSpy).toHaveBeenCalled();

    expect(removeSpy.calls.count()).toBe(1, "one domain removed");
    expect(removeSpy.calls.argsFor(0)[0]).toBe(
      "baz-id",
      'domain that wasnt in "uris" removed'
    );

    expect(addSpy.calls.count()).toBe(1, "one domain added");
    expect(addSpy.calls.argsFor(0)[0].hostname).toBe(
      "bar",
      'domain that was in "uris" but not in domain service added'
    );
    expect(addSpy.calls.argsFor(0)[0]).toEqual(
      {
        orgKey: ro.portalSelf?.urlKey,
        orgId: ro.portalSelf?.id,
        orgTitle: ro.portalSelf?.name,
        hostname: "bar",
        siteId: site.item.id,
        siteTitle: site.item.title,
        clientKey: site.data?.values.clientId,
        sslOnly: false,
      },
      "correct parameters for addDomain"
    );
  });

  it("defaults to sslOnly=true for greenfield site", async () => {
    const uris = ["foo", "bar"];

    getDomainsSpy.and.returnValue(Promise.resolve([]));

    await updateSiteApplicationUris(site, uris, ro);

    expect(addSpy.calls.count()).toBe(2, "correct number of domains added");
    expect(addSpy.calls.argsFor(0)[0].sslOnly).toBeTruthy();
    expect(addSpy.calls.argsFor(1)[0].sslOnly).toBeTruthy();
  });

  it("does nothing on portal", async () => {
    const uris = ["foo", "bar"];

    await updateSiteApplicationUris(site, uris, {
      isPortal: true,
    } as IHubRequestOptions);

    expect(getDomainsSpy).not.toHaveBeenCalled();
    expect(removeSpy).not.toHaveBeenCalled();
    expect(addSpy).not.toHaveBeenCalled();
  });
});
