import { IPortal } from "@esri/arcgis-rest-portal";
import { getHubUrlFromPortal } from "./get-hub-url-from-portal";

/**
 * Return the Portal url based on the portal self
 * @param {Object} portal Portal Self
 */
export function getHubApiUrlFromPortal(portal: IPortal): string {
  return `${getHubUrlFromPortal(portal)}/api/v3`;
}
