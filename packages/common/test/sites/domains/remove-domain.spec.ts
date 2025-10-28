import * as fetchMock from "fetch-mock";
import * as _checkStatusAndParseJsonModule from "../../../src/sites/domains/_check-status-and-parse-json";
import { removeDomain } from "../../../src/sites/domains/remove-domain";
import { IHubRequestOptions } from "../../../src/hub-types";
import {
  describe,
  it,
  expect,
  afterEach,
  vi,
} from "vitest";

describe("removeDomain", function () {
  const domainId = "146663";

  afterEach(() => {
    fetchMock.restore();
    vi.restoreAllMocks();
  });

  it("removes domain", async function () {
    const ro = { isPortal: false } as IHubRequestOptions;

    vi.spyOn(
      _checkStatusAndParseJsonModule,
      "_checkStatusAndParseJson"
    ).mockReturnValue(Promise.resolve({ success: true }) as any);

    fetchMock.delete(`end:api/v3/domains/${domainId}`, {});

    const res = await removeDomain(domainId, ro);
    expect(fetchMock.done()).toBeTruthy("fetch should have been called once");
    expect(res.success).toBeTruthy("json parsed and response returned");
  });

  it("throws error on portal", async function () {
    const ro = { isPortal: true } as IHubRequestOptions;

    vi.spyOn(
      _checkStatusAndParseJsonModule,
      "_checkStatusAndParseJson"
    ).mockReturnValue(Promise.resolve({ success: true }) as any);

    fetchMock.put(`end:api/v3/domains/${domainId}`, {});

    expect(() => removeDomain(domainId, ro)).toThrowError();

    expect(fetchMock.calls().length).toBe(
      0,
      "fetch should NOT have been called"
    );
  });
});
