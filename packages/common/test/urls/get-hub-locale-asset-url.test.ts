import { IPortal } from "@esri/arcgis-rest-portal";
import { getHubLocaleAssetUrl } from "../../src";
import { cloneObject } from "../../src";

describe("getHubLocaleAssetUrl", function() {
  const portal: IPortal = {
    id: "portal-id",
    name: "Some Portal",
    isPortal: true,
    portalHostname: "devext.someportal.com"
  };

  it("isPortal = true", function() {
    portal.isPortal = true;
    const url = getHubLocaleAssetUrl(portal);
    expect(url).toEqual("https://devext.someportal.com/apps/sites");
  });

  it("isPortal = false", function() {
    portal.isPortal = false;
    const url = getHubLocaleAssetUrl(portal);
    expect(url).toEqual(
      "https://d1011m9qpnz5mw.cloudfront.net/opendata-ui/assets"
    );
  });

  it("defaults to prod", function() {
    const localPortal = cloneObject(portal);
    localPortal.isPortal = false;
    localPortal.portalHostname = "notexist.portal.com";
    const url = getHubLocaleAssetUrl(localPortal);
    expect(url).toEqual(
      "https://d1iq7pbacwn5rb.cloudfront.net/opendata-ui/assets"
    );
  });
});
