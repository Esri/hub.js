import * as lookupDomainModule from "../../../src/sites/domains/lookup-domain";
import { isDomainUsedElsewhere } from "../../../src";
import { IHubRequestOptions } from "../../../src";

describe("isDomainUsedElsewhere", function () {
  it("resolves to true when domain entry exists for other site", async function () {
    spyOn(lookupDomainModule, "lookupDomain").and.returnValue(
      Promise.resolve({ siteId: "foobarbaz" })
    );

    const res = await isDomainUsedElsewhere(
      "some-domain",
      "some-id",
      {} as IHubRequestOptions
    );

    expect(res).toBeTruthy();
  });

  it("resolves to false when domain entry has same site id", async function () {
    spyOn(lookupDomainModule, "lookupDomain").and.returnValue(
      Promise.resolve({ siteId: "foobarbaz" })
    );

    const res = await isDomainUsedElsewhere(
      "some-domain",
      "foobarbaz",
      {} as IHubRequestOptions
    );

    expect(res).toBeFalsy();
  });

  it("resolves to false when domain entry does not exist", async function () {
    spyOn(lookupDomainModule, "lookupDomain").and.returnValue(Promise.reject());

    const res = await isDomainUsedElsewhere(
      "some-domain",
      "foobarbaz",
      {} as IHubRequestOptions
    );

    expect(res).toBeFalsy();
  });
});
