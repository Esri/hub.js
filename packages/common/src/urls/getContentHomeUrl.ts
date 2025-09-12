import { IPortal } from "@esri/arcgis-rest-portal";
import { IHubRequestOptions } from "../hub-types";
import { IRequestOptions } from "@esri/arcgis-rest-request";
import { getPortalUrl } from "./get-portal-url";

/**
 * Computes a URL to the "Content" tab in the AGO Home app for a given portal URL string, IPortal, IHubRequestOptions or IRequestOptions object
 * @param portalUrlOrObject a portal URL string, IPortal, IHubRequestOptions or IRequestOptions object
 * @returns a URL string for the AGO Home for the given portalUrlOrObject parameter
 */
export function getContentHomeUrl(
  portalUrlOrObject?: string | IPortal | IHubRequestOptions | IRequestOptions
): string {
  const portalUrl = getPortalUrl(portalUrlOrObject);
  return `${portalUrl}/home/content.html`;
}
