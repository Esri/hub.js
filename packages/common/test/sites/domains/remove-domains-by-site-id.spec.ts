import * as fetchMock from "fetch-mock";
import * as _checkStatusAndParseJsonModule from "../../../src/sites/domains/_check-status-and-parse-json";
import { removeDomainsBySiteId } from "../../../src/sites/domains/remove-domains-by-site-id";
import { IHubRequestOptions } from "../../../src/hub-types";
import { vi } from "vitest";

describe("removeDomainsBySiteId", function () {
  const domainSiteId = "foobarbaz1234";
  afterEach(() => {
    fetchMock.restore();
    vi.restoreAllMocks();
  });

  it("removes domains", async () => {
    const ro = { isPortal: false } as IHubRequestOptions;

    vi.spyOn(
      _checkStatusAndParseJsonModule,
      "_checkStatusAndParseJson"
    ).mockReturnValue(Promise.resolve({ success: true }) as any);

    fetchMock.delete(`end:api/v3/domains/?siteId=${domainSiteId}`, {});

    const res = await removeDomainsBySiteId(domainSiteId, ro);
    expect(fetchMock.done()).toBeTruthy("fetch should have been called once");
    expect(res.success).toEqual(true);
  });

  it("throws error on portal", async () => {
    const ro = { isPortal: true } as IHubRequestOptions;

    vi.spyOn(
      _checkStatusAndParseJsonModule,
      "_checkStatusAndParseJson"
    ).mockReturnValue(Promise.resolve({ success: true }) as any);

    fetchMock.put(`end:api/v3/domains/?siteId=${domainSiteId}`, {});

    expect(() => removeDomainsBySiteId(domainSiteId, ro)).toThrowError(
      Error,
      "removeDomainsBySiteId is not available in ArcGIS Enterprise. Instead, edit the hubdomain typekeyword on the item"
    );
    expect(fetchMock.calls().length).toBe(
      0,
      "fetch should NOT have been called"
    );
  });
});
