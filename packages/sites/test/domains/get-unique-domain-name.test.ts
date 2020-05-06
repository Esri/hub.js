import { getUniqueDomainName } from "../../src/domains";
import * as domainExistsModule from "../../src/domains/domain-exists";
import { IHubRequestOptions } from "@esri/hub-common";

describe("getUniqueDomainName", function() {
  it("generates a unique name", async function() {
    const initialDomain = "foobar";
    const baseHostname = "arcgis";
    spyOn(domainExistsModule, "domainExists").and.callFake(function(
      candidate: string
    ) {
      return Promise.resolve(
        [
          `${initialDomain}-${baseHostname}`,
          `${initialDomain}-1-${baseHostname}`
        ].indexOf(candidate) !== -1
      );
    });

    const uniqueDomain = await getUniqueDomainName(
      initialDomain,
      baseHostname,
      {} as IHubRequestOptions
    );

    expect(uniqueDomain).toBe("foobar-2");
  });
});
