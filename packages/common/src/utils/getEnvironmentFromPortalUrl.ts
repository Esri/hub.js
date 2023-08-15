import { HubEnvironment } from "../permissions";

export function getEnvironmentFromPortalUrl(portalUrl: string): HubEnvironment {
  // default to enterprise because we don't know the patterns for that
  // other than it's _not_ arcgis.com
  let env: HubEnvironment = "enterprise";
  // if we're on arcgis.com, we can assume prod...
  if (portalUrl.includes("arcgis.com")) {
    env = "production";
  }
  // unless we're on a subdomain which suggest we might be in a dev or qa environment
  if (
    portalUrl.includes("qaext.arcgis.com") ||
    portalUrl.includes("mapsqa.arcgis.com")
  ) {
    env = "qaext";
  }
  if (
    portalUrl.includes("devext.arcgis.com") ||
    portalUrl.includes("mapsdev.arcgis.com")
  ) {
    env = "devext";
  }

  return env;
}
