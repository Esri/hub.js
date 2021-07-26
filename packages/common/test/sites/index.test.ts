import * as domainsModule from "../../src/sites/domains";
import * as getSiteByIdModule from "../../src/sites/get-site-by-id";
import { fetchSite, IModel, IHubRequestOptions } from "../../src";

describe("fetchSite", () => {
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
    lookupDomainSpy = spyOn(domainsModule, "lookupDomain").and.returnValue(
      Promise.resolve(domainRecord)
    );

    getSiteSpy = spyOn(getSiteByIdModule, "getSiteById").and.returnValue(
      Promise.resolve(site)
    );
  });

  it("accepts an item ID", async () => {
    const chk = await fetchSite(siteId, requestOptions);
    expect(chk).toEqual(site);
    expect(lookupDomainSpy).not.toHaveBeenCalled();
    expect(getSiteSpy).toHaveBeenCalledWith(siteId, requestOptions);
  });

  it("accepts a site URL", async () => {
    const chk = await fetchSite(
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
    const chk = await fetchSite("okokokko-dc.hubqa.arcgis.com", requestOptions);
    expect(chk).toEqual(site);
    expect(lookupDomainSpy).toHaveBeenCalledWith(
      "okokokko-dc.hubqa.arcgis.com",
      requestOptions
    );
    expect(getSiteSpy).toHaveBeenCalledWith(siteId, requestOptions);
  });

  it("accepts a site slug", async () => {
    const portalRO = { isPortal: true } as IHubRequestOptions;
    const chk = await fetchSite("okokokko", portalRO);
    expect(chk).toEqual(site);
    expect(lookupDomainSpy).toHaveBeenCalledWith("okokokko", portalRO);
    expect(getSiteSpy).toHaveBeenCalledWith(siteId, portalRO);
  });
});
