import { IPortal } from "@esri/arcgis-rest-portal";
import { getHubUrl } from './get-hub-url';

/**
 * Return the Portal url based on the portal self
 * @param {Object} portal Portal Self
 */
export function getHubApiUrl(portal: IPortal): string {
  return `${getHubUrl(portal)}/api/v3`;
}

