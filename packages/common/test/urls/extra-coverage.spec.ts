import { vi, describe, it, expect } from "vitest";

vi.mock("@esri/arcgis-rest-portal", () => ({
  // provide a mock getPortalUrl that returns the standard arcgis online sharing URL
  getPortalUrl: (): string => "https://www.arcgis.com/sharing/rest",
}));

import { getGroupHomeUrl } from "../../src/urls/getGroupHomeUrl";
import { getPortalUrl } from "../../src/urls/get-portal-url";
import * as featureUrls from "../../src/urls/feature-service-urls";
import { _getLocation } from "../../src/urls/_get-location";

describe("extra url coverage", () => {
  it("identifies map and feature server urls and returns service types", () => {
    const mapUrl = "https://example.com/arcgis/rest/services/MyMap/MapServer";
    const featUrl =
      "https://example.com/arcgis/rest/services/MyFeat/FeatureServer";
    const other = "https://example.com/something/else";

    expect(featureUrls.isMapOrFeatureServerUrl(mapUrl)).toBe(true);
    expect(featureUrls.getServiceTypeFromUrl(mapUrl)).toEqual("Map Service");

    expect(featureUrls.isMapOrFeatureServerUrl(featUrl)).toBe(true);
    expect(featureUrls.getServiceTypeFromUrl(featUrl)).toEqual(
      "Feature Service"
    );

    expect(featureUrls.isMapOrFeatureServerUrl(other)).toBe(false);
    // implementation returns null for no match in this environment
    expect(featureUrls.getServiceTypeFromUrl(other)).toBeNull();
  });

  it("builds portal urls from portal self objects and requests", () => {
    const portalObj = {
      isPortal: true,
      portalHostname: "server.example.org",
    } as any;
    expect(getPortalUrl(portalObj)).toEqual("https://server.example.org");

    const portalCloud = {
      isPortal: false,
      urlKey: "org",
      customBaseUrl: "maps.arcgis.com",
    } as any;
    expect(getPortalUrl(portalCloud)).toEqual("https://org.maps.arcgis.com");

    const apiUrl = "https://org.maps.arcgis.com/sharing/rest";
    expect(getPortalUrl(apiUrl)).toEqual("https://org.maps.arcgis.com");
  });

  it("returns group home urls using getPortalUrl", () => {
    const groupId = "abc123";
    const portal = "https://org.maps.arcgis.com";
    expect(getGroupHomeUrl(groupId, portal)).toEqual(
      `${portal}/home/group.html?id=${groupId}`
    );
  });

  it("_getLocation returns window.location when window is present", () => {
    // provide a fake window object for node environment
    (global as any).window = { location: { href: "https://test.local" } };
    const loc = _getLocation();
    expect(loc).toBeDefined();
    expect((loc as any).href).toEqual("https://test.local");
    // clean up
    delete (global as any).window;
  });

  it("_getLocation returns undefined when window is not present", () => {
    // ensure window is set but undefined to avoid ReferenceError when referenced
    (global as any).window = undefined;
    const loc = _getLocation();
    expect(loc).toBeUndefined();
  });

  it("getPortalUrl returns default when called with undefined", () => {
    const result = getPortalUrl(undefined);
    expect(result).toEqual("https://www.arcgis.com");
  });

  // NOTE: cannot spy on ESM module namespace exports reliably in this environment,
  // so we assert the default behavior for undefined input above instead.
});
