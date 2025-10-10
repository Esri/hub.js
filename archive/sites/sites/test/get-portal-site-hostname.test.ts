import { getPortalSiteHostname } from "../src";
import { IPortal } from "@esri/arcgis-rest-portal";

describe("getPortalSiteHostname", () => {
  it("gets the site hostname + fragment", async () => {
    const subDomain = "sub-domain";

    let portal = {
      allSSL: false,
      httpPort: 80,
      customBaseUrl: "instance",
      portalHostname: "foobar.com/instance",
    } as unknown as IPortal;

    expect(getPortalSiteHostname(subDomain, portal)).toBe(
      "foobar.com/instance/apps/sites/#/sub-domain"
    );

    portal = {
      allSSL: false,
      httpPort: 80,
      customBaseUrl: "other",
      portalHostname: "foobar.com",
    } as unknown as IPortal;

    expect(getPortalSiteHostname(subDomain, portal)).toBe(
      "foobar.com/apps/sites/#/sub-domain"
    );

    portal = {
      allSSL: false,
      httpPort: 23,
      customBaseUrl: "instance",
      portalHostname: "foobar.com/instance",
    } as unknown as IPortal;

    expect(getPortalSiteHostname(subDomain, portal)).toBe(
      "foobar.com:23/instance/apps/sites/#/sub-domain",
      "attaches custom http port"
    );

    portal = {
      allSSL: true,
      httpsPort: 443,
      customBaseUrl: "other",
      portalHostname: "foobar.com/instance",
    } as unknown as IPortal;

    expect(getPortalSiteHostname(subDomain, portal)).toBe(
      "foobar.com/instance/apps/sites/#/sub-domain",
      "ssl default port"
    );

    portal = {
      allSSL: true,
      httpsPort: 234, // random, not 80
      customBaseUrl: "other",
      portalHostname: "foobar.com/instance",
    } as unknown as IPortal;

    expect(getPortalSiteHostname(subDomain, portal)).toBe(
      "foobar.com:234/instance/apps/sites/#/sub-domain",
      "attaches ssl custom port"
    );
  });
});
