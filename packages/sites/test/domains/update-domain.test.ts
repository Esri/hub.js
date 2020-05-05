import { IHubRequestOptions } from "@esri/hub-common";
import { updateDomain } from "../../src/domains";
import * as fetchMock from "fetch-mock";
import * as _checkStatusAndParseJsonModule from "../../src/domains/_check-status-and-parse-json";

describe("updateDomain", function() {
  const domainEntry = {
    clientKey: "hdlf3lCPRguoTFr6",
    domain: "zebra-dc.hubqa.arcgis.com",
    hostname: "zebra-dc.hubqa.arcgis.com",
    id: "146663",
    orgId: "97KLIFOSt5CxbiRI",
    orgKey: "dc",
    orgTitle: "Washington, DC R&D Center (QA)",
    permanentRedirect: false,
    siteId: "9697f67b6d6343fa823dcdbe2d172073",
    siteTitle: "Zebra",
    sslOnly: true
  };

  it("updates domain", async function() {
    const ro = { isPortal: false } as IHubRequestOptions;

    spyOn(
      _checkStatusAndParseJsonModule,
      "_checkStatusAndParseJson"
    ).and.returnValue(Promise.resolve({ success: true }));

    fetchMock.put(`end:utilities/domains/${domainEntry.id}`, {});

    const res = await updateDomain(domainEntry, ro);
    expect(fetchMock.done()).toBeTruthy("fetch should have been called once");
    expect(res.success).toBeTruthy("json parsed and response returned");
  });

  it("throws error on portal", async function() {
    const ro = { isPortal: true } as IHubRequestOptions;

    spyOn(
      _checkStatusAndParseJsonModule,
      "_checkStatusAndParseJson"
    ).and.returnValue(Promise.resolve({ success: true }));

    fetchMock.put(`end:utilities/domains/${domainEntry.id}`, {});

    expect(() => updateDomain(domainEntry, ro)).toThrowError();

    expect(fetchMock.calls().length).toBe(
      0,
      "fetch should NOT have been called"
    );
  });
});
