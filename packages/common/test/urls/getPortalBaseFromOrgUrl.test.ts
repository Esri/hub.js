import { getPortalBaseFromOrgUrl } from "../../src";
describe("getPortalBaseUrlFromOrgUrl:", () => {
  it("returns original url if not matched", () => {
    const chk = getPortalBaseFromOrgUrl("https://myserver.com");
    expect(chk).toBe("https://myserver.com");
  });
  it("works for qa", () => {
    const chk = getPortalBaseFromOrgUrl("https://qaext.arcgis.com");
    expect(chk).toBe("https://qaext.arcgis.com");
    const chk2 = getPortalBaseFromOrgUrl("https://org.mapsqa.arcgis.com");
    expect(chk2).toBe("https://qaext.arcgis.com");
  });

  it("works for dev", () => {
    const chk = getPortalBaseFromOrgUrl("https://devext.arcgis.com");
    expect(chk).toBe("https://devext.arcgis.com");
    const chk2 = getPortalBaseFromOrgUrl("https://org.mapsdevext.arcgis.com");
    expect(chk2).toBe("https://devext.arcgis.com");
  });
  it("works for prod", () => {
    const chk = getPortalBaseFromOrgUrl("https://www.arcgis.com");
    expect(chk).toBe("https://www.arcgis.com");
    const chk2 = getPortalBaseFromOrgUrl("https://org.maps.arcgis.com");
    expect(chk2).toBe("https://www.arcgis.com");
  });
});
