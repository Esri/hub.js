import { getPortalUrl } from "./get-portal-url";
import { IPortal } from "@esri/arcgis-rest-portal";

/**
 * Return the URL of the item's page in the Portal Home application
 * @param itemId The item's ID
 * @param portal Portal Self
 */
export function getItemHomeUrl(
  itemId: string,
  portalOrUrl: string | IPortal
): string {
  const portalUrl =
    typeof portalOrUrl === "string" ? portalOrUrl : getPortalUrl(portalOrUrl);
  return `${portalUrl}/home/item.html?id=${itemId}`;
}
