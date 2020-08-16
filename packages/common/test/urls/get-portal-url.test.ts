import { IPortal } from "@esri/arcgis-rest-portal";
import { getPortalUrl, IHubRequestOptions } from "../../src";

describe("getPortalUrl", function() {
  const portalApiUrl = "https://www.arcgis.com/sharing/rest";
  let portalSelf: IPortal;
  beforeEach(() => {
    portalSelf = {
      isPortal: true,
      id: "some-id",
      name: "Portal Name",
      portalHostname: "portal-hostname.com",
      urlKey: "www",
      customBaseUrl: "custom-base-url.com"
    };
  });
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
      const result = getPortalUrl(portalApiUrl);
      expect(result).toBe("https://www.arcgis.com");
    });
    it("should strip /sharing/rest/", () => {
      const result = getPortalUrl(`${portalApiUrl}/`);
      expect(result).toBe("https://www.arcgis.com");
    });
  });
  describe("when passed request options", () => {
    let requestOptions: IHubRequestOptions;
    beforeEach(() => {
      requestOptions = {
        portal: portalApiUrl,
        isPortal: true,
        portalSelf,
        hubApiUrl: "hub-api-url,com",
        // TODO: wh
        authentication: null
      };
    });
    it("prefers portal API URL", () => {
      const result = getPortalUrl(requestOptions);
      expect(result).toBe("https://www.arcgis.com");
    });
    it("uses portal self if API URL is not available", () => {
      delete requestOptions.portal;
      const result = getPortalUrl(requestOptions);
      expect(result).toBe("https://portal-hostname.com");
    });
  });
});
