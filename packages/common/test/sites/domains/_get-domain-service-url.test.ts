import { _getDomainServiceUrl } from "../../../src/sites/domains";
import { IHubRequestOptions } from "../../../src";

describe("_getDomainServiceUrl", function () {
  it("gets the url", function () {
    const hubApiUrl = "hub-api-url";
    expect(_getDomainServiceUrl(hubApiUrl)).toBe(`${hubApiUrl}/api/v3/domains`);

    expect(_getDomainServiceUrl(null)).toBe(
      `https://hub.arcgis.com/api/v3/domains`
    );
  });
});
