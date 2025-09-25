import { IPortal } from "@esri/arcgis-rest-portal";
import { getHubLocaleAssetUrl } from "../../src/urls/get-hub-locale-asset-url";
import { cloneObject } from "../../src/util";

describe("getHubLocaleAssetUrl", function () {
  const portal: IPortal = {
    id: "portal-id",
    name: "Some Portal",
    isPortal: true,
    portalHostname: "devext.someportal.com",
  };

  it("isPortal = true", function () {
    portal.isPortal = true;
    const url = getHubLocaleAssetUrl(portal);
    expect(url).toEqual("https://devext.someportal.com/apps/sites");
  });

  it("isPortal = false", function () {
    portal.isPortal = false;
    const url = getHubLocaleAssetUrl(portal);
    expect(url).toEqual("https://hubdevcdn.arcgis.com/opendata-ui/assets");
  });

  it("defaults to prod", function () {
    const localPortal = cloneObject(portal);
    localPortal.isPortal = false;
    localPortal.portalHostname = "notexist.portal.com";
    const url = getHubLocaleAssetUrl(localPortal);
    expect(url).toEqual("https://hubcdn.arcgis.com/opendata-ui/assets");
  });
});
