import * as fetchMock from "fetch-mock";
import * as _checkStatusAndParseJsonModule from "../../../src/sites/domains/_check-status-and-parse-json";
import * as _lookupPortalModule from "../../../src/sites/domains/_lookup-portal";
import { IDomainEntry, IHubRequestOptions } from "../../../src/hub-types";
import { lookupDomain } from "../../../src/sites/domains/lookup-domain";
import {
  describe,
  it,
  expect,
  afterEach,
  vi,
} from "vitest";

describe("lookupDomain", function () {
  const domainId = "146663";
  afterEach(() => {
    fetchMock.restore();
    vi.restoreAllMocks();
  });

  it("looks up domain on portal", async function () {
    const ro = { isPortal: true } as IHubRequestOptions;

    const portalDomainEntry = {
      hostname: "someurl",
      siteId: "someid",
    };
    vi.spyOn(_lookupPortalModule, "_lookupPortal").mockReturnValue(
      Promise.resolve(portalDomainEntry) as any
    );

    fetchMock.get(`end:api/v3/domains/${domainId}`, {});

    const res = await lookupDomain(domainId, ro);

    expect(_lookupPortalModule._lookupPortal).toHaveBeenCalled();
    expect(fetchMock.called()).toBeFalsy("fetch not called");
    expect(res).toEqual(portalDomainEntry);
  });

  it("looks up domain outside portal", async function () {
    const ro = { isPortal: false } as IHubRequestOptions;

    vi.spyOn(
      _checkStatusAndParseJsonModule,
      "_checkStatusAndParseJson"
    ).mockReturnValue(Promise.resolve({ id: "domain-record-id" }) as any);

    fetchMock.get(`end:api/v3/domains/${domainId}`, {});

    const res = (await lookupDomain(domainId, ro)) as IDomainEntry;

    expect(fetchMock.done()).toBeTruthy("fetch should have been called");
    expect(fetchMock.calls()[0][1].mode).toBe(
      "cors",
      "fetch called in cors mode"
    );
    expect(res.id).toBe("domain-record-id");
  });
});
