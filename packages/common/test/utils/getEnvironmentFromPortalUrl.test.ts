import { getEnvironmentFromPortalUrl } from "../../src";

describe("getEnvironmentFromPortalUrl:", () => {
  it('should return "prod" for portalUrl containing "arcgis.com"', () => {
    const portalUrl = "https://www.arcgis.com";
    const env = getEnvironmentFromPortalUrl(portalUrl);
    expect(env).toBe("production");
  });

  it('should return "qaext" for portalUrl containing "qaext.arcgis.com" or "mapsqa.arcgis.com"', () => {
    const portalUrl1 = "https://qaext.arcgis.com";
    const portalUrl2 = "https://www.mapsqa.arcgis.com";
    const env1 = getEnvironmentFromPortalUrl(portalUrl1);
    const env2 = getEnvironmentFromPortalUrl(portalUrl2);
    expect(env1).toBe("qaext");
    expect(env2).toBe("qaext");
  });

  it('should return "devext" for portalUrl containing "devext.arcgis.com" or "mapsdev.arcgis.com"', () => {
    const portalUrl1 = "https://devext.arcgis.com";
    const portalUrl2 = "https://www.mapsdev.arcgis.com";
    const env1 = getEnvironmentFromPortalUrl(portalUrl1);
    const env2 = getEnvironmentFromPortalUrl(portalUrl2);
    expect(env1).toBe("devext");
    expect(env2).toBe("devext");
  });

  it('should return "enterprise" for portalUrl not containing "arcgis.com"', () => {
    const portalUrl = "https://myportal.com";
    const env = getEnvironmentFromPortalUrl(portalUrl);
    expect(env).toBe("enterprise");
  });
});
