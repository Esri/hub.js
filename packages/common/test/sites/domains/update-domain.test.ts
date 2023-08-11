import { getProp, IHubRequestOptions, IDomainEntry } from "../../../src";
import { updateDomain } from "../../../src/sites/domains";
import * as fetchMock from "fetch-mock";
import * as _checkStatusAndParseJsonModule from "../../../src/sites/domains/_check-status-and-parse-json";

describe("updateDomain", function () {
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
    sslOnly: true,
  };

  it("updates domain", async function () {
    const ro = { isPortal: false } as IHubRequestOptions;

    spyOn(
      _checkStatusAndParseJsonModule,
      "_checkStatusAndParseJson"
    ).and.returnValue(Promise.resolve({ success: true }));

    fetchMock.put(`end:api/v3/domains/${domainEntry.id}`, {});

    const res = await updateDomain(domainEntry, ro);
    expect(fetchMock.done()).toBeTruthy("fetch should have been called once");
    expect(res.success).toBeTruthy("json parsed and response returned");
  });

  it("converts title to a string", async function () {
    const entry = {
      clientKey: "hdlf3lCPRguoTFr6",
      domain: "zebra-dc.hubqa.arcgis.com",
      hostname: "zebra-dc.hubqa.arcgis.com",
      id: "146663",
      orgId: "97KLIFOSt5CxbiRI",
      orgKey: "dc",
      orgTitle: "Washington, DC R&D Center (QA)",
      permanentRedirect: false,
      siteId: "9697f67b6d6343fa823dcdbe2d172073",
      siteTitle: 1234,
      sslOnly: true,
    } as unknown as IDomainEntry;
    const ro = { isPortal: false } as IHubRequestOptions;

    spyOn(
      _checkStatusAndParseJsonModule,
      "_checkStatusAndParseJson"
    ).and.returnValue(Promise.resolve({ success: true }));

    fetchMock.put(`end:api/v3/domains/${entry.id}`, {});

    const res = await updateDomain(entry, ro);
    expect(fetchMock.done()).toBeTruthy("fetch should have been called once");
    const opts = fetchMock.lastOptions(`end:api/v3/domains/${entry.id}`);
    const body = JSON.parse(opts.body as string);
    expect(getProp(body, "siteTitle")).toBe(
      "1234",
      "should coerce numeric title to a string"
    );
    expect(res.success).toBeTruthy("json parsed and response returned");
  });

  it("converts title to a string", async function () {
    const entry = {
      domain: "zebra-dc.hubqa.arcgis.com",
      hostname: "zebra-dc.hubqa.arcgis.com",
      id: "146663",
      orgId: "97KLIFOSt5CxbiRI",
      orgKey: "dc",
      orgTitle: "Washington, DC R&D Center (QA)",
      permanentRedirect: false,
      siteId: "9697f67b6d6343fa823dcdbe2d172073",
      siteTitle: 1234,
      sslOnly: true,
    } as unknown as IDomainEntry;
    const ro = { isPortal: false } as IHubRequestOptions;

    spyOn(
      _checkStatusAndParseJsonModule,
      "_checkStatusAndParseJson"
    ).and.returnValue(Promise.resolve({ success: true }));

    fetchMock.put(`end:api/v3/domains/${entry.id}`, {});

    const res = await updateDomain(entry, ro);
    expect(fetchMock.done()).toBeTruthy("fetch should have been called once");
    const opts = fetchMock.lastOptions(`end:api/v3/domains/${entry.id}`);
    const body = JSON.parse(opts.body as string);
    expect(getProp(body, "siteTitle")).toBe(
      "1234",
      "should coerce numeric title to a string"
    );
    expect(res.success).toBeTruthy("json parsed and response returned");
  });

  it("throws error on portal", async function () {
    const ro = { isPortal: true } as IHubRequestOptions;

    spyOn(
      _checkStatusAndParseJsonModule,
      "_checkStatusAndParseJson"
    ).and.returnValue(Promise.resolve({ success: true }));

    fetchMock.put(`end:api/v3/domains/${domainEntry.id}`, {});

    expect(() => updateDomain(domainEntry, ro)).toThrowError();

    expect(fetchMock.calls().length).toBe(
      0,
      "fetch should NOT have been called"
    );
  });

  it("updates domain when no client key is passed in", async function () {
    const ro = { isPortal: false } as IHubRequestOptions;

    spyOn(
      _checkStatusAndParseJsonModule,
      "_checkStatusAndParseJson"
    ).and.returnValue(Promise.resolve({ success: true }));

    const entry = {
      domain: "zebra-dc.hubqa.arcgis.com",
      hostname: "zebra-dc.hubqa.arcgis.com",
      id: "146663",
      orgId: "97KLIFOSt5CxbiRI",
      orgKey: "dc",
      orgTitle: "Washington, DC R&D Center (QA)",
      permanentRedirect: false,
      siteId: "9697f67b6d6343fa823dcdbe2d172073",
      siteTitle: "Zebra",
      sslOnly: true,
    };
    fetchMock.put(`end:api/v3/domains/${entry.id}`, {});

    const res = await updateDomain(entry, ro);
    expect(fetchMock.done()).toBeTruthy("fetch should have been called once");
    expect(res.success).toBeTruthy("json parsed and response returned");
  });
});
