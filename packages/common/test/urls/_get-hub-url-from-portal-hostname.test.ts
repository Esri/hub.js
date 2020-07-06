import { _getHubUrlFromPortalHostname } from "../../src/urls/_get-hub-url-from-portal-hostname";


describe("_getHubUrlFromPortalHostname", () => {
  
  it("returns undefined for non-AGO URLs", () => {
    let portal = "https://some.portal.com/arcgis/sharing/rest";
    expect(_getHubUrlFromPortalHostname(portal)).toBe(undefined);
  });

  it("can retrieve prod base url", () => {
    let portal = "https://something.maps.arcgis.com/sharing/rest";
    expect(_getHubUrlFromPortalHostname(portal)).toBe("https://hub.arcgis.com");
  });

  it("can retrieve qa base url", () => {
    let portal =
      "https://something.mapsqa.arcgis.com/sharing/rest";
    expect(_getHubUrlFromPortalHostname(portal)).toBe("https://hubqa.arcgis.com");
  });

  it("can retrieve dev base url", () => {
    let portal =
      "https://something.mapsdevext.arcgis.com/sharing/rest";
    expect(_getHubUrlFromPortalHostname(portal)).toBe("https://hubdev.arcgis.com");
  });

  it("can retrieve prod base url", () => {
    let portal = "https://www.arcgis.com/sharing/rest";
    expect(_getHubUrlFromPortalHostname(portal)).toBe("https://hub.arcgis.com");
  });

  it("can retrieve qa base url 2", () => {
    let portal = "https://qaext.arcgis.com/sharing/rest";
    expect(_getHubUrlFromPortalHostname(portal)).toBe("https://hubqa.arcgis.com");
  });

  it("can retrieve dev base url 2", () => {
    let portal = "https://devext.arcgis.com/sharing/rest";
    expect(_getHubUrlFromPortalHostname(portal)).toBe("https://hubdev.arcgis.com");
  });
});
