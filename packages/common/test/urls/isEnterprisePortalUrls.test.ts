import { isEnterprisePortalUrl } from "../../src";

describe("isEnterprisePortalUrl", () => {
  it("returns true for a typical enterprise portal URL", () => {
    expect(isEnterprisePortalUrl("https://myserver.com/portal")).toBe(true);
    expect(
      isEnterprisePortalUrl("https://myserver.com/portal/sharing/rest")
    ).toBe(true);
  });

  it("returns false for a public ArcGIS Online URL", () => {
    expect(isEnterprisePortalUrl("https://www.arcgis.com")).toBe(false);
    expect(isEnterprisePortalUrl("https://www.arcgis.com/sharing/rest")).toBe(
      false
    );
    expect(isEnterprisePortalUrl("https://maps.arcgis.com/sharing/rest")).toBe(
      false
    );
    expect(isEnterprisePortalUrl("https://qaext.arcgis.com/sharing/rest")).toBe(
      false
    );
    expect(
      isEnterprisePortalUrl("https://devext.arcgis.com/sharing/rest")
    ).toBe(false);
    expect(
      isEnterprisePortalUrl("https://mapsqa.arcgis.com/sharing/rest")
    ).toBe(false);
    expect(
      isEnterprisePortalUrl("https://mapsdev.arcgis.com/sharing/rest")
    ).toBe(false);
  });

  it("returns true for a deep subdomain enterprise portal domain", () => {
    expect(
      isEnterprisePortalUrl("https://deep.subdomain.myserver.com/portal")
    ).toBe(true);
  });

  it("returns true for a random unrelated URL", () => {
    expect(isEnterprisePortalUrl("https://example.com")).toBe(true);
  });

  it("returns false for an empty string", () => {
    expect(isEnterprisePortalUrl("")).toBe(false);
    expect(isEnterprisePortalUrl(12 as unknown as string)).toBe(false);
  });

  it("returns true for a portal URL with a port", () => {
    expect(
      isEnterprisePortalUrl(
        "https://portal.enterprise.myserver.com:7443/arcgis"
      )
    ).toBe(true);
  });

  it("returns false for a malformed URL", () => {
    expect(isEnterprisePortalUrl("not a url")).toBe(false);
  });
});
