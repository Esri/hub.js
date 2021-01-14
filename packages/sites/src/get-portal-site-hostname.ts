import { IPortal } from "@esri/arcgis-rest-portal";

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
  // portalHostname will include the /<instance>
  // i.e. `dev0016196.esri.com/portal`, but since we may need to
  const host = portal.portalHostname.split("/")[0];
  // wrangle the instance using customBaseUrl
  let instance = "/";
  if (portal.customBaseUrl) {
    instance = `/${portal.customBaseUrl}/`;
  }

  return `${host}${port}${instance}apps/sites/#/${subdomain}`;
}
