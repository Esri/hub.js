import { IHubRequestOptions } from "../../../src/hub-types";
import * as domainExistsModule from "../../../src/sites/domains/domain-exists";
import { getUniqueDomainName } from "../../../src/sites/domains/get-unique-domain-name";
import {
  describe,
  it,
  expect,
  vi,
} from "vitest";

describe("getUniqueDomainName", function () {
  it("generates a unique name", async function () {
    const initialDomain = "foobar";
    const baseHostname = "arcgis";
    vi.spyOn(domainExistsModule, "domainExists").mockImplementation(function (
      candidate: string
    ) {
      return Promise.resolve(
        [
          `${initialDomain}-${baseHostname}`,
          `${initialDomain}-1-${baseHostname}`,
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
