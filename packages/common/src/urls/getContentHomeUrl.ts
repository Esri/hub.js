import { IPortal } from "@esri/arcgis-rest-portal/dist/esm/util/get-portal";
import { IHubRequestOptions } from "../types";
import { IRequestOptions } from "@esri/arcgis-rest-request/dist/esm/utils/IRequestOptions";
import { getPortalUrl } from "./get-portal-url";

export function getContentHomeUrl(
  portalUrlOrObject?: string | IPortal | IHubRequestOptions | IRequestOptions
): string {
  const portalUrl = getPortalUrl(portalUrlOrObject);
  return `${portalUrl}/home/content.html`;
}
