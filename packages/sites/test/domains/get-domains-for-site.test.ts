import * as fetchMock from "fetch-mock";
import { getDomainsForSite, IDomainEntry } from "../../src/domains";
import { IHubRequestOptions } from "@esri/hub-common";

describe("getDomainsForSite", function() {
  const domains = ([{ some: "domain" }] as unknown) as IDomainEntry[];
  it("resolves with the domain entries for a site", async function() {
    const siteId = "siteId";
    const responseConfig = { body: JSON.stringify(domains), status: 200 };
    fetchMock.get(`end:?siteId=${siteId}`, responseConfig);

    const res = await getDomainsForSite(siteId, {} as IHubRequestOptions);

    expect(fetchMock.done()).toBeTruthy("fetch called correct number of times");
    expect(fetchMock.calls()[0][1].mode).toBe("cors");
    expect(res).toEqual(domains);
  });

  it("resolves with empty array on portal", async function() {
    const siteId = "siteId";
    const responseConfig = { body: JSON.stringify(domains), status: 200 };
    fetchMock.get(`end:?siteId=${siteId}`, responseConfig);

    const res = await getDomainsForSite(siteId, {
      isPortal: true
    } as IHubRequestOptions);

    expect(res).toEqual([]);
    expect(fetchMock.calls().length).toBe(0, "fetch never called");
  });

  it("rejects if problem", async function() {
    const siteId = "siteId";
    const responseConfig = { body: JSON.stringify(domains), status: 404 };
    fetchMock.get(`end:?siteId=${siteId}`, responseConfig);

    try {
      await getDomainsForSite(siteId, {} as IHubRequestOptions);
      fail("should reject");
    } catch (err) {
      expect(err).toBeDefined();
    }

    expect(fetchMock.done()).toBeTruthy("fetch called correct number of times");
    expect(fetchMock.calls()[0][1].mode).toBe("cors");
  });
});
