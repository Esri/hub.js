import * as domainModule from "../../src/sites/domains";
import * as getSiteModule from "../../src/sites/get-site-by-id";
import { fetchSiteModel } from "../../src/sites/fetchSiteModel";
import { IHubRequestOptions, IModel } from "../../src/types";

describe("fetchSiteModel", () => {
  const siteId = "042584cf391c428e995e97eccdebb8f8";

  const site = {
    item: { id: siteId },
    data: {},
  } as IModel;

  const domainRecord = { siteId };

  const requestOptions = {} as IHubRequestOptions;

  let lookupDomainSpy: jasmine.Spy;
  let getSiteSpy: jasmine.Spy;
  beforeEach(() => {
    lookupDomainSpy = spyOn(domainModule, "lookupDomain").and.returnValue(
      Promise.resolve(domainRecord)
    );

    getSiteSpy = spyOn(getSiteModule, "getSiteById").and.returnValue(
      Promise.resolve(site)
    );
  });

  it("accepts an item ID", async () => {
    const chk = await fetchSiteModel(siteId, requestOptions);
    expect(chk).toEqual(site);
    expect(lookupDomainSpy).not.toHaveBeenCalled();
    expect(getSiteSpy).toHaveBeenCalledWith(siteId, requestOptions);
  });

  it("accepts a site URL", async () => {
    const chk = await fetchSiteModel(
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
    const chk = await fetchSiteModel(
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
    const portalRO = { isPortal: true } as IHubRequestOptions;
    const chk = await fetchSiteModel("okokokko", portalRO);
    expect(chk).toEqual(site);
    expect(lookupDomainSpy).toHaveBeenCalledWith("okokokko", portalRO);
    expect(getSiteSpy).toHaveBeenCalledWith(siteId, portalRO);
  });
});
