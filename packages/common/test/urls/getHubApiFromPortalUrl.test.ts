import { getHubApiFromPortalUrl } from "../../src";

describe("getHubApiFromPortalUrl:", () => {
  it("returns undefined if url is not recognized:", () => {
    const chk = getHubApiFromPortalUrl("https://www.foo.com");
    expect(chk).toBeUndefined();
  });
  it("works for qa", () => {
    const chk = getHubApiFromPortalUrl("https://qaext.arcgis.com");
    expect(chk).toBe("https://hubqa.arcgis.com");
    const chk2 = getHubApiFromPortalUrl("https://org.mapsqa.arcgis.com");
    expect(chk2).toBe("https://hubqa.arcgis.com");
  });

  it("works for dev", () => {
    const chk = getHubApiFromPortalUrl("https://devext.arcgis.com");
    expect(chk).toBe("https://hubdev.arcgis.com");
    const chk2 = getHubApiFromPortalUrl("https://org.mapsdevext.arcgis.com");
    expect(chk2).toBe("https://hubdev.arcgis.com");
  });
  it("works for prod", () => {
    const chk = getHubApiFromPortalUrl("https://www.arcgis.com");
    expect(chk).toBe("https://hub.arcgis.com");
    const chk2 = getHubApiFromPortalUrl("https://org.maps.arcgis.com");
    expect(chk2).toBe("https://hub.arcgis.com");
  });
});
