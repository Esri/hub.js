import { IHubRequestOptions } from "../../../src/hub-types";
import * as domainExistsModule from "../../../src/sites/domains/domain-exists-portal";
import { getUniqueDomainNamePortal } from "../../../src/sites/domains/get-unique-domain-name-portal";

describe("getUniqueDomainNamePortal", function () {
  it("generates a unique name on portal", async function () {
    const initialDomain = "foobar";
    jest
      .spyOn(domainExistsModule, "domainExistsPortal")
      .mockImplementation(function (candidate: string) {
        return Promise.resolve(
          [`${initialDomain}`, `${initialDomain}-1`].indexOf(candidate) !== -1
        );
      });

    const uniqueDomain = await getUniqueDomainNamePortal(
      initialDomain,
      {} as IHubRequestOptions
    );

    expect(uniqueDomain).toBe("foobar-2");
  });
});
