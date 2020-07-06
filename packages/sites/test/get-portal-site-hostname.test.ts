import { getPortalSiteHostname } from "../src";
import * as commonModule from "@esri/hub-common";
import { IPortal } from "@esri/arcgis-rest-portal";

describe("getPortalSiteHostname", () => {
  it("gets the ", async () => {
    const currentLoc = {
      hostname: "foobar.com",
      pathname: "/admin/boop/"
    };

    spyOn(commonModule, "_getLocation").and.returnValue(currentLoc);

    const subDomain = "sub-domain";

    let portal = ({
      allSSL: false,
      httpPort: 80 // random, not 80
    } as unknown) as IPortal;

    expect(getPortalSiteHostname(subDomain, portal)).toBe(
      "foobar.com/boop/#/sub-domain"
    );

    portal = ({
      allSSL: false,
      httpPort: 23 // random, not 80
    } as unknown) as IPortal;

    expect(getPortalSiteHostname(subDomain, portal)).toBe(
      "foobar.com:23/boop/#/sub-domain",
      "attaches custom http port"
    );

    portal = ({
      allSSL: true,
      httpsPort: 443 // random, not 80
    } as unknown) as IPortal;

    expect(getPortalSiteHostname(subDomain, portal)).toBe(
      "foobar.com/boop/#/sub-domain",
      "ssl default port"
    );

    portal = ({
      allSSL: true,
      httpsPort: 234 // random, not 80
    } as unknown) as IPortal;

    expect(getPortalSiteHostname(subDomain, portal)).toBe(
      "foobar.com:234/boop/#/sub-domain",
      "attaches ssl custom port"
    );
  });
});
