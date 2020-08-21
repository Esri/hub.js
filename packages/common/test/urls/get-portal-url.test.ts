import * as arcgisRestPortal from "@esri/arcgis-rest-portal";
import { getPortalUrl, IHubRequestOptions } from "../../src";
import { IRequestOptions } from "@esri/arcgis-rest-request";

describe("getPortalUrl", function() {
  const portalApiUrl = "https://www.arcgis.com/sharing/rest";
  let portalSelf: arcgisRestPortal.IPortal;
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
    let requestOptions: IRequestOptions;
    beforeEach(() => {
      requestOptions = {
        portal: portalApiUrl
      };
    });
    it("prefers to build URL from portal self", () => {
      const hubRequestOptions: IHubRequestOptions = {
        ...requestOptions,
        isPortal: true,
        portalSelf,
        hubApiUrl: "hub-api-url,com",
        authentication: null
      };
      const result = getPortalUrl(hubRequestOptions);
      expect(result).toBe("https://portal-hostname.com");
    });
    it("falls back to portal (REST API URL) if no portal self", () => {
      // TODO: for some reason this spy only works the first time this is run???
      // const spy = spyOn(arcgisRestPortal, 'getPortalUrl').and.returnValue(portalApiUrl)
      const result = getPortalUrl(requestOptions);
      expect(result).toBe("https://www.arcgis.com");
      // expect(spy.calls.argsFor(0)).toEqual([requestOptions])
    });
  });
});
