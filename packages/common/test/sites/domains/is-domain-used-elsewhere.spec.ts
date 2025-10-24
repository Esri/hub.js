import { IHubRequestOptions } from "../../../src/hub-types";
import { isDomainUsedElsewhere } from "../../../src/sites/domains/is-domain-used-elsewhere";
import * as lookupDomainModule from "../../../src/sites/domains/lookup-domain";
import { describe, it, expect, afterEach, vi } from "vitest";

describe("isDomainUsedElsewhere", function () {
  afterEach(() => vi.restoreAllMocks());

  it("resolves to true when domain entry exists for other site", async function () {
    vi.spyOn(lookupDomainModule, "lookupDomain").mockReturnValue(
      Promise.resolve({ siteId: "foobarbaz" }) as any
    );

    const res = await isDomainUsedElsewhere(
      "some-domain",
      "some-id",
      {} as IHubRequestOptions
    );

    expect(res).toBeTruthy();
  });

  it("resolves to false when domain entry has same site id", async function () {
    vi.spyOn(lookupDomainModule, "lookupDomain").mockReturnValue(
      Promise.resolve({ siteId: "foobarbaz" }) as any
    );

    const res = await isDomainUsedElsewhere(
      "some-domain",
      "foobarbaz",
      {} as IHubRequestOptions
    );

    expect(res).toBeFalsy();
  });

  it("resolves to false when domain entry does not exist", async function () {
    vi.spyOn(lookupDomainModule, "lookupDomain").mockReturnValue(
      Promise.reject() as any
    );

    const res = await isDomainUsedElsewhere(
      "some-domain",
      "foobarbaz",
      {} as IHubRequestOptions
    );

    expect(res).toBeFalsy();
  });
});
