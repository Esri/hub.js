import { IPortal } from "@esri/arcgis-rest-portal";
import { getPortalSiteHostname } from "./get-portal-site-hostname";

/**
 * Construct the site url for a Portal Site item
 * @param {String} subdomain Subdomain for the site
 * @param {Object} portal Portal Self
 */
export function getPortalSiteUrl(subdomain: string, portal: IPortal) {
  let protocol = "http:";
  if (portal.allSSL) {
    protocol = "https:";
  }
  const siteRoute = getPortalSiteHostname(subdomain, portal);
  return `${protocol}//${siteRoute}`;
}
