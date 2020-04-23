import { getPortalUrl } from "./get-portal-url";
import { IPortal } from "@esri/arcgis-rest-portal";

/**
 * Return the portal sharing api base url, based on portal self
 * @param {Object} portal Portal Self
 */
export function getPortalApiUrl(portal: IPortal): string {
  return `${getPortalUrl(portal)}/sharing/rest`;
}
