import { IPortal } from "@esri/arcgis-rest-portal";

/**
 * Return the Portal url based on the portal self
 * @param {Object} portal Portal Self
 */
export function getPortalUrl(portal: IPortal): string {
  if (portal.isPortal) {
    return `https://${portal.portalHostname}`;
  } else {
    return `https://${portal.urlKey}.${portal.customBaseUrl}`;
  }
}
