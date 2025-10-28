import * as fetchMock from "fetch-mock";
import { IHubRequestOptions } from "../../../src/hub-types";
import { domainExists } from "../../../src/sites/domains/domain-exists";
import { describe, it, expect, afterEach, vi } from "vitest";

describe("domainExists", function () {
  const domainId = "146663";
  afterEach(() => {
    fetchMock.restore();
    vi.restoreAllMocks();
  });

  it("returns false and true correctly", async function () {
    const ro = { isPortal: false } as IHubRequestOptions;

    fetchMock.get(`end:api/v3/domains/${domainId}`, { status: 200 });

    const res = await domainExists(domainId, ro);

    expect(fetchMock.done()).toBeTruthy(); // fetch should have been called once
    expect(res).toBeTruthy(); // should return true if not 404

    fetchMock.resetHistory();
    fetchMock.get(
      `end:api/v3/domains/${domainId}`,
      { status: 404 },
      { overwriteRoutes: true }
    );

    const res2 = await domainExists(domainId, ro);

    expect(fetchMock.done()).toBeTruthy(); // fetch should have been called once
    expect(res2).toBeFalsy(); // should return false for 404
  });

  it("throws error on portal", async function () {
    const ro = { isPortal: true } as IHubRequestOptions;

    fetchMock.get(`end:api/v3/domains/${domainId}`, {});

    expect(() => domainExists(domainId, ro)).toThrowError();

    expect(fetchMock.calls().length).toBe(0); // fetch should NOT have been called
  });
});
