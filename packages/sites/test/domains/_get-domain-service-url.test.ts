import { _getDomainServiceUrl } from "../../src/domains";
import { IHubRequestOptions } from "@esri/hub-common";

describe("_getDomainServiceUrl", function() {
  it("gets the url", function() {
    const hubApiUrl = "hub-api-url";
    expect(_getDomainServiceUrl(hubApiUrl)).toBe(`${hubApiUrl}/api/v3/domains`);

    expect(_getDomainServiceUrl(null)).toBe(
      `https://hub.arcgis.com/api/v3/domains`
    );
  });
});
