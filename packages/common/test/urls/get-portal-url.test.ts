import { IPortal } from "@esri/arcgis-rest-portal";
import { getPortalUrl } from "../../src";

describe("getPortalUrl", function() {
  const portalSelf: IPortal = {
    isPortal: true,
    id: "some-id",
    name: "Portal Name",
    portalHostname: "portal-hostname.com",
    urlKey: "www",
    customBaseUrl: "custom-base-url.com"
  };

  describe("when passed a portal", () => {
    it("uses portalHostname when isPortal", function() {
      portalSelf.isPortal = true;
      expect(getPortalUrl(portalSelf)).toEqual(
        `https://${portalSelf.portalHostname}`
      );
    });

    it("constructs url when NOT isPortal", function() {
      portalSelf.isPortal = false;
      expect(getPortalUrl(portalSelf)).toEqual(
        `https://${portalSelf.urlKey}.${portalSelf.customBaseUrl}`
      );
    });
  });
  describe("when passed a portal API URL", () => {
    it("should strip /sharing/rest", () => {
      const result = getPortalUrl("https://www.arcgis.com/sharing/rest");
      expect(result).toBe("https://www.arcgis.com");
    });
    it("should strip /sharing/rest/", () => {
      const result = getPortalUrl("https://www.arcgis.com/sharing/rest/");
      expect(result).toBe("https://www.arcgis.com");
    });
  });
});
