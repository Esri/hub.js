import { _getPortalDomainTypeKeyword } from "../src";

describe("_getPortalDomainTypeKeyword", () => {
  it("computes correct keyword", () => {
    expect(_getPortalDomainTypeKeyword("SubDomaIn")).toBe(
      "hubsubdomain|subdomain"
    );
  });
});
