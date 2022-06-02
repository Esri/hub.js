import { IRequestOptions } from "@esri/arcgis-rest-request";
import { IPortal } from "@esri/arcgis-rest-portal";
import { IHubRequestOptions } from "../types";
import { getPortalUrl } from "./get-portal-url";

/**
 * Return the URL of the group's page in the Portal Home application
 * @param groupId The group's ID
 * @param portalUrlOrObject a portal base or API URL, a portal object, or request options containing either of those
 * @returns URL to the groups's url, defaults to `https://www.arcgis.com/home/group.html?id={group.id}`
 */
export function getGroupHomeUrl(
  groupId: string,
  portalUrlOrObject?: string | IPortal | IHubRequestOptions | IRequestOptions
): string {
  const portalUrl = getPortalUrl(portalUrlOrObject);
  return `${portalUrl}/home/group.html?id=${groupId}`;
}
