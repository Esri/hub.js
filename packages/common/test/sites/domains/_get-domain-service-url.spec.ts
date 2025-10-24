import { _getDomainServiceUrl } from "../../../src/sites/domains/_get-domain-service-url";
import {
  describe,
  it,
  expect,
} from "vitest";

describe("_getDomainServiceUrl", function () {
  it("gets the url", function () {
    const hubApiUrl = "hub-api-url";
    expect(_getDomainServiceUrl(hubApiUrl)).toBe(`${hubApiUrl}/api/v3/domains`);

    expect(_getDomainServiceUrl(null)).toBe(
      `https://hub.arcgis.com/api/v3/domains`
    );
  });
});
