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
  // portalHostname will include the /<adaptor>
  // i.e. `dev0016196.esri.com/portal`, but since we may need to inject a port
  // we split things apart, and then recombine
  const parts = portal.portalHostname.split("/");
  const host = parts[0];
  let adaptor = "/"; // if there is no /<adaptor> then / should be valid
  if (parts[1]) {
    adaptor = `/${parts[1]}/`;
  }
  // construct the url
  return `${host}${port}${adaptor}apps/sites/#/${subdomain}`;
  // Note: in *most* cases the result would be the same as the line below
  // but there are some scenarios where we need to do the construction
  // so we can't simply use portalHostname
  // return `${portal.portalHostname}/apps/sites/#/${subdomain}`
}
