import { IHubRequestOptions, getProp, IDomainEntry } from "../../../src";
import { addDomain } from "../../../src/sites/domains";
import * as fetchMock from "fetch-mock";
import * as _checkStatusAndParseJsonModule from "../../../src/sites/domains/_check-status-and-parse-json";

describe("addDomain", function () {
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

  it("sends request in AGO", async function () {
    const ro = { isPortal: false } as IHubRequestOptions;

    spyOn(
      _checkStatusAndParseJsonModule,
      "_checkStatusAndParseJson"
    ).and.returnValue(Promise.resolve({ success: true }));

    fetchMock.post("end:api/v3/domains", {});

    const res = await addDomain(domainEntry, ro);
    expect(fetchMock.done()).toBeTruthy("fetch should have been called once");
    expect(res.success).toBeTruthy("json parsed and response returned");
    const opts = fetchMock.lastOptions("end:api/v3/domains");
    const body = JSON.parse(opts.body as string);
    expect(getProp(body, "clientKey")).toBe(
      "",
      "should update clientKey to empty string"
    );
  });

  it("converts title to string", async function () {
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

    fetchMock.post("end:api/v3/domains", {});

    const res = await addDomain(entry, ro);
    expect(fetchMock.done()).toBeTruthy("fetch should have been called once");
    const opts = fetchMock.lastOptions("end:api/v3/domains");
    const body = JSON.parse(opts.body as string);
    expect(getProp(body, "siteTitle")).toBe(
      "1234",
      "should coerce numeric title to a string"
    );
    expect(getProp(body, "clientKey")).toBe(
      "",
      "should update clientKey to empty string"
    );
    expect(res.success).toBeTruthy("json parsed and response returned");
  });

  it("converts title to string without client key", async function () {
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

    fetchMock.post("end:api/v3/domains", {});

    const res = await addDomain(entry, ro);
    expect(fetchMock.done()).toBeTruthy("fetch should have been called once");
    const opts = fetchMock.lastOptions("end:api/v3/domains");
    const body = JSON.parse(opts.body as string);
    expect(getProp(body, "siteTitle")).toBe(
      "1234",
      "should coerce numeric title to a string"
    );
    expect(getProp(body, "clientKey")).toBe(
      undefined,
      "should not have client key"
    );
    expect(res.success).toBeTruthy("json parsed and response returned");
  });

  it("function runs as expected without a client key (code coverage)", async function () {
    const ro = { isPortal: false } as IHubRequestOptions;

    spyOn(
      _checkStatusAndParseJsonModule,
      "_checkStatusAndParseJson"
    ).and.returnValue(Promise.resolve({ success: true }));

    fetchMock.post("end:api/v3/domains", {});

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

    const res = await addDomain(entry, ro);
    expect(fetchMock.done()).toBeTruthy("fetch should have been called once");
    expect(res.success).toBeTruthy("json parsed and response returned");
    const opts = fetchMock.lastOptions("end:api/v3/domains");
    const body = JSON.parse(opts.body as string);
    expect(getProp(body, "clientKey")).toBe(
      undefined,
      "should not have clientKey"
    );
  });

  it("throws error on portal", async function () {
    const ro = { isPortal: true } as IHubRequestOptions;

    spyOn(
      _checkStatusAndParseJsonModule,
      "_checkStatusAndParseJson"
    ).and.returnValue(Promise.resolve({ success: true }));

    fetchMock.post("end:api/v3/domains", {});

    expect(() => addDomain(domainEntry, ro)).toThrowError();

    expect(fetchMock.calls().length).toBe(
      0,
      "fetch should NOT have been called"
    );
  });
});
