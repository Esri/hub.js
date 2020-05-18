import { IPortal } from "@esri/arcgis-rest-portal";
import { _getLocation } from "@esri/hub-common";

/**
 * Return the correct route for the portal hosted site
 * @param {String} subdomain Subdomain for the site
 * @param {Object} portal Portal Self
 */
export function getPortalSiteHostname(subdomain: string, portal: IPortal) {
  let port;
  if (portal.allSSL) {
    port = portal.httpsPort !== 443 ? `:${portal.httpsPort}` : "";
  } else {
    port = portal.httpPort !== 80 ? `:${portal.httpPort}` : "";
  }
  const curLocation = _getLocation();
  const host = curLocation.hostname;
  const basePath = curLocation.pathname.replace(/\/admin\//, "/");

  return `${host}${port}${basePath}#/${subdomain}`;
}
