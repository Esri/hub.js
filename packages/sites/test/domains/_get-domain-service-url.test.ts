import { _getDomainServiceUrl } from "../../src/domains";
import { IHubRequestOptions } from "@esri/hub-common";

describe("_getDomainServiceUrl", function() {
  it("gets the url", function() {
    const ro = { hubApiUrl: "hub-api-url" } as IHubRequestOptions;
    expect(_getDomainServiceUrl(ro)).toBe(`${ro.hubApiUrl}/utilities/domains`);

    delete ro.hubApiUrl;
    expect(_getDomainServiceUrl(ro)).toBe(
      `https://hub.arcgis.com/utilities/domains`
    );
  });
});
