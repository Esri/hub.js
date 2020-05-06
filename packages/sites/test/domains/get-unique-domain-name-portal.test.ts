import { getUniqueDomainNamePortal } from "../../src/domains";
import { IHubRequestOptions } from "@esri/hub-common";
import * as domainExistsModule from "../../src/domains/domain-exists-portal";

describe("getUniqueDomainNamePortal", function() {
  it("generates a unique name on portal", async function() {
    const initialDomain = "foobar";
    spyOn(domainExistsModule, "domainExistsPortal").and.callFake(function(
      candidate: string
    ) {
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
