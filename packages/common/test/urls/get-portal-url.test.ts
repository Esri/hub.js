import { IPortal } from "@esri/arcgis-rest-portal";
import { getPortalUrl } from "../../src";

describe("getPortalUrl", function() {
  const portalSelfResponse: IPortal = {
    isPortal: true,
    id: "some-id",
    name: "Portal Name",
    portalHostname: "portal-hostname.com",
    urlKey: "www",
    customBaseUrl: "custom-base-url.com"
  };

  it("uses portalHostname when isPortal", function() {
    portalSelfResponse.isPortal = true;
    expect(getPortalUrl(portalSelfResponse)).toEqual(
      `https://${portalSelfResponse.portalHostname}`
    );
  });

  it("constructs url when NOT isPortal", function() {
    portalSelfResponse.isPortal = false;
    expect(getPortalUrl(portalSelfResponse)).toEqual(
      `https://${portalSelfResponse.urlKey}.${portalSelfResponse.customBaseUrl}`
    );
  });
});
