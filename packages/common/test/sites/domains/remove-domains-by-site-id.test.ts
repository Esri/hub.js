import { IHubRequestOptions } from "../../../src";
import { removeDomainsBySiteId } from "../../../src/sites/domains";
import * as fetchMock from "fetch-mock";
import * as _checkStatusAndParseJsonModule from "../../../src/sites/domains/_check-status-and-parse-json";

describe("removeDomainsBySiteId", function () {
  const domainSiteId = "foobarbaz1234";

  it("removes domains", async () => {
    const ro = { isPortal: false } as IHubRequestOptions;

    spyOn(
      _checkStatusAndParseJsonModule,
      "_checkStatusAndParseJson"
    ).and.returnValue(Promise.resolve({ success: true }));

    fetchMock.delete(`end:api/v3/domains/?siteId=${domainSiteId}`, {});

    const res = await removeDomainsBySiteId(domainSiteId, ro);
    expect(fetchMock.done()).toBeTruthy("fetch should have been called once");
    expect(res.success).toEqual(true);
  });

  it("throws error on portal", async () => {
    const ro = { isPortal: true } as IHubRequestOptions;

    spyOn(
      _checkStatusAndParseJsonModule,
      "_checkStatusAndParseJson"
    ).and.returnValue(Promise.resolve({ success: true }));

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
