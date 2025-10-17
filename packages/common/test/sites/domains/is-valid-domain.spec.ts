import * as fetchMock from "fetch-mock";
import { IHubRequestOptions } from "../../../src/hub-types";
import { isValidDomain } from "../../../src/sites/domains/is-valid-domain";
import { vi } from "vitest";

describe("isValidDomain", function () {
  afterEach(() => {
    fetchMock.restore();
    vi.restoreAllMocks();
  });

  it("success is true when domain valid", async function () {
    const domainName = "domain";
    const ro = { isPortal: false } as IHubRequestOptions;
    fetchMock.get(`end:/api/v3/domains/validate?hostname=${domainName}`, {
      success: true,
    });

    const res = await isValidDomain(domainName, ro);

    expect(fetchMock.done()).toBeTruthy("fetch should have been called");
    expect(res).toBeTruthy("should have returned true");
  });

  it("success is false when domain INvalid", async function () {
    const domainName = "domain";
    const ro = { isPortal: false } as IHubRequestOptions;
    fetchMock.get(`end:/api/v3/domains/validate?hostname=${domainName}`, 400);

    const res = await isValidDomain(domainName, ro);

    expect(fetchMock.done()).toBeTruthy("fetch should have been called");
    expect(res.success).toBe(false);
  });

  it("throws an error on portal", function () {
    const domainName = "domain";
    const ro = { isPortal: true } as IHubRequestOptions;

    fetchMock.get(`end:/api/v3/domains/validate?hostname=${domainName}`, {});

    expect(() => isValidDomain(domainName, ro)).toThrowError();

    expect(fetchMock.calls().length).toBe(
      0,
      "fetch should NOT have been called"
    );
  });
});
