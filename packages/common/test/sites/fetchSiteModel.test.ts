import * as commonModule from "../../src";

describe("fetchSiteModel", () => {
  const siteId = "042584cf391c428e995e97eccdebb8f8";

  const site = {
    item: { id: siteId },
    data: {},
  } as commonModule.IModel;

  const domainRecord = { siteId };

  const requestOptions = {} as commonModule.IHubRequestOptions;

  let lookupDomainSpy: jasmine.Spy;
  let getSiteSpy: jasmine.Spy;
  beforeEach(() => {
    lookupDomainSpy = spyOn(commonModule, "lookupDomain").and.returnValue(
      Promise.resolve(domainRecord)
    );

    getSiteSpy = spyOn(commonModule, "getSiteById").and.returnValue(
      Promise.resolve(site)
    );
  });

  it("accepts an item ID", async () => {
    const chk = await commonModule.fetchSiteModel(siteId, requestOptions);
    expect(chk).toEqual(site);
    expect(lookupDomainSpy).not.toHaveBeenCalled();
    expect(getSiteSpy).toHaveBeenCalledWith(siteId, requestOptions);
  });

  it("accepts a site URL", async () => {
    const chk = await commonModule.fetchSiteModel(
      "https://okokokko-dc.hubqa.arcgis.com/foo/bar",
      requestOptions
    );
    expect(chk).toEqual(site);
    expect(lookupDomainSpy).toHaveBeenCalledWith(
      "okokokko-dc.hubqa.arcgis.com",
      requestOptions
    );
    expect(getSiteSpy).toHaveBeenCalledWith(siteId, requestOptions);
  });

  it("accepts a site hostname", async () => {
    const chk = await commonModule.fetchSiteModel(
      "okokokko-dc.hubqa.arcgis.com",
      requestOptions
    );
    expect(chk).toEqual(site);
    expect(lookupDomainSpy).toHaveBeenCalledWith(
      "okokokko-dc.hubqa.arcgis.com",
      requestOptions
    );
    expect(getSiteSpy).toHaveBeenCalledWith(siteId, requestOptions);
  });

  it("accepts a site slug", async () => {
    const portalRO = { isPortal: true } as commonModule.IHubRequestOptions;
    const chk = await commonModule.fetchSiteModel("okokokko", portalRO);
    expect(chk).toEqual(site);
    expect(lookupDomainSpy).toHaveBeenCalledWith("okokokko", portalRO);
    expect(getSiteSpy).toHaveBeenCalledWith(siteId, portalRO);
  });
});
