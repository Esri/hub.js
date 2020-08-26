import { IPortal } from "@esri/arcgis-rest-portal";
import { getPortalUrl } from "./get-portal-url";
import { HUB_CDN_URLMAP } from "./hub-cdn-urlmap";

// TODO: should this take IHubRequestOptions as well as a portal?
// if so, address when we tackle https://github.com/Esri/hub.js/issues/321
/**
 * Given a Portal object, return the full Hub locale asset url
 * Used for fetching translations
 * @param {Object} portal Portal Self
 */
export function getHubLocaleAssetUrl(portal: IPortal): string {
  if (portal.isPortal) {
    // Enterprise - use Site app as source for assets
    const baseUrl = getPortalUrl(portal);
    return `${baseUrl}/apps/sites`;
  } else {
    // AGO - Convert portalHostname into CDN url
    const index: "devext" | "qaext" | "www" = portal.portalHostname.split(
      "."
    )[0];
    const base = HUB_CDN_URLMAP[index] || HUB_CDN_URLMAP.www;
    return `${base}/opendata-ui/assets`;
  }
}
