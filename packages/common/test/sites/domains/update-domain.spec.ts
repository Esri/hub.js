import * as fetchMock from "fetch-mock";
import * as _checkStatusAndParseJsonModule from "../../../src/sites/domains/_check-status-and-parse-json";
import { updateDomain } from "../../../src/sites/domains/update-domain";
import { IHubRequestOptions } from "../../../src/hub-types";
import { vi } from "vitest";

describe("updateDomain", function () {
  const domainId = "146663";

  afterEach(() => {
    fetchMock.restore();
    vi.restoreAllMocks();
  });

  it("updates domain", async function () {
    const ro = { isPortal: false } as IHubRequestOptions;

    vi.spyOn(
      _checkStatusAndParseJsonModule,
      "_checkStatusAndParseJson"
    ).mockReturnValue(Promise.resolve({ success: true }) as any);

    const domainEntry = { id: domainId, siteTitle: "title" } as any;

    fetchMock.put(`end:api/v3/domains/${domainId}`, {});

    const res = await updateDomain(domainEntry, ro);
    expect(fetchMock.done()).toBeTruthy("fetch should have been called once");
    expect(res.success).toBeTruthy("json parsed and response returned");
  });

  it("throws error on portal", async function () {
    const ro = { isPortal: true } as IHubRequestOptions;

    vi.spyOn(
      _checkStatusAndParseJsonModule,
      "_checkStatusAndParseJson"
    ).mockReturnValue(Promise.resolve({ success: true }) as any);

    const domainEntry = { id: domainId } as any;

    fetchMock.put(`end:api/v3/domains/${domainId}`, {});

    expect(() => updateDomain(domainEntry, ro)).toThrowError();

    expect(fetchMock.calls().length).toBe(
      0,
      "fetch should NOT have been called"
    );
  });

  it("converts numeric siteTitle and clears clientKey", async function () {
    const ro = { isPortal: false } as IHubRequestOptions;

    vi.spyOn(
      _checkStatusAndParseJsonModule,
      "_checkStatusAndParseJson"
    ).mockReturnValue(Promise.resolve({ success: true }) as any);

    const domainEntry = {
      id: domainId,
      siteTitle: 1234,
      clientKey: "abc",
    } as any;

    fetchMock.put(`end:api/v3/domains/${domainId}`, {});

    const res = await updateDomain(domainEntry, ro);
    expect(fetchMock.done()).toBeTruthy("fetch should have been called once");
    const opts = fetchMock.lastOptions(`end:api/v3/domains/${domainId}`);
    const body = JSON.parse(opts.body as string);
    expect(body.siteTitle).toBe("1234");
    expect(body.clientKey).toBe("");
    expect(res.success).toBeTruthy();
  });
});
