import * as fetchMock from "fetch-mock";
import { getDomainsForSite } from "../../../src/sites/domains/get-domains-for-site";
import { IDomainEntry, IHubRequestOptions } from "../../../src/hub-types";
import { vi } from "vitest";

describe("getDomainsForSite", function () {
  afterEach(() => {
    fetchMock.restore();
    vi.restoreAllMocks();
  });
  const domains = [{ some: "domain" }] as unknown as IDomainEntry[];
  it("resolves with the domain entries for a site", async function () {
    const siteId = "siteId";
    const responseConfig = { body: JSON.stringify(domains), status: 200 };
    fetchMock.get(`end:?siteId=${siteId}`, responseConfig);

    const res = await getDomainsForSite(siteId, {} as IHubRequestOptions);

    expect(fetchMock.done()).toBeTruthy("fetch called correct number of times");
    expect(fetchMock.calls()[0][1].mode).toBe("cors");
    expect(res).toEqual(domains);
  });

  it("resolves with empty array on portal", async function () {
    const siteId = "siteId";
    const responseConfig = { body: JSON.stringify(domains), status: 200 };
    fetchMock.get(`end:?siteId=${siteId}`, responseConfig);

    const res = await getDomainsForSite(siteId, {
      isPortal: true,
    } as IHubRequestOptions);

    expect(res).toEqual([]);
    expect(fetchMock.calls().length).toBe(0, "fetch never called");
  });

  it("rejects if problem", async function () {
    const siteId = "siteId";
    const responseConfig = { body: JSON.stringify(domains), status: 404 };
    fetchMock.get(`end:?siteId=${siteId}`, responseConfig);

    await expect(
      getDomainsForSite(siteId, {} as IHubRequestOptions)
    ).rejects.toBeDefined();

    expect(fetchMock.done()).toBeTruthy("fetch called correct number of times");
    expect(fetchMock.calls()[0][1].mode).toBe("cors");
  });
});
