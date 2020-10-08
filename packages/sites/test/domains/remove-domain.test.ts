import { IHubRequestOptions } from "@esri/hub-common";
import { removeDomain } from "../../src/domains";
import * as fetchMock from "fetch-mock";
import * as _checkStatusAndParseJsonModule from "../../src/domains/_check-status-and-parse-json";

describe("removeDomain", function() {
  const domainId = "146663";

  it("removes domain", async function() {
    const ro = { isPortal: false } as IHubRequestOptions;

    spyOn(
      _checkStatusAndParseJsonModule,
      "_checkStatusAndParseJson"
    ).and.returnValue(Promise.resolve({ success: true }));

    fetchMock.delete(`end:api/v3/domains/${domainId}`, {});

    const res = await removeDomain(domainId, ro);
    expect(fetchMock.done()).toBeTruthy("fetch should have been called once");
    expect(res.success).toBeTruthy("json parsed and response returned");
  });

  it("throws error on portal", async function() {
    const ro = { isPortal: true } as IHubRequestOptions;

    spyOn(
      _checkStatusAndParseJsonModule,
      "_checkStatusAndParseJson"
    ).and.returnValue(Promise.resolve({ success: true }));

    fetchMock.put(`end:api/v3/domains/${domainId}`, {});

    expect(() => removeDomain(domainId, ro)).toThrowError();

    expect(fetchMock.calls().length).toBe(
      0,
      "fetch should NOT have been called"
    );
  });
});
