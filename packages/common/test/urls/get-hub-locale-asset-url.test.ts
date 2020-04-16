import { IPortal } from "@esri/arcgis-rest-portal";
import { getHubLocaleAssetUrl } from "../../src";

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
});
