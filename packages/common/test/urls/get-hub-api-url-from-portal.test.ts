import { IPortal } from "@esri/arcgis-rest-portal";
import { getHubApiUrlFromPortal } from "../../src";

describe("getHubApiUrl", function() {
  it("returns the correct url", function() {
    const portal: IPortal = {
      id: "portal-id",
      name: "Some Portal",
      isPortal: false,
      portalHostname: "devext.arcgis.com"
    };

    const apiUrl = getHubApiUrlFromPortal(portal);
    expect(apiUrl.includes("/api/v3"));
  });
});
