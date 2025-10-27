import type { IPortal } from "@esri/arcgis-rest-portal";
import { getPortalApiUrl } from "../../src/urls/get-portal-api-url";
import { describe, it, expect } from "vitest";

describe("getPortalApiUrl", function () {
  it("returns the correct url", function () {
    const portal: IPortal = {
      id: "portal-id",
      name: "Some Portal",
      isPortal: true,
      portalHostname: "someportal.com",
    };

    const apiUrl = getPortalApiUrl(portal);
    expect(apiUrl.includes("/sharing/rest"));
  });
});
