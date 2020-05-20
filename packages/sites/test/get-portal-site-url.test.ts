import { getPortalSiteUrl } from "../src";
import * as getHostModule from "../src/get-portal-site-hostname";
import { IPortal } from "@esri/arcgis-rest-portal";

describe("getPortalSiteUrl", () => {
  it("gets the right url", async () => {
    spyOn(getHostModule, "getPortalSiteHostname").and.returnValue(
      "portal-host-name"
    );

    const subdomain = "sub-domain";

    expect(getPortalSiteUrl(subdomain, {} as IPortal)).toBe(
      "http://portal-host-name"
    );

    expect(
      getPortalSiteUrl(subdomain, ({ allSSL: true } as unknown) as IPortal)
    ).toBe("https://portal-host-name");
  });
});
