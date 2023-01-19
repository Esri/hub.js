import { IRequestOptions } from "@esri/arcgis-rest-request";
import { getProp } from "../objects/get-prop";
import { getPortalBaseFromOrgUrl } from "../urls/getPortalBaseFromOrgUrl";
import { getPortal } from "@esri/arcgis-rest-portal";

/**
 * Fetches the portal for a given org.
 *
 * @param orgId
 * @param options request options
 * @returns
 */
export function fetchOrg(orgId: string, options?: IRequestOptions) {
  const orgPortalUrl =
    getProp(options, "portal") ||
    getProp(options, "authentication.portal") ||
    "www.arcgis.com";

  // In order to get the correct response, we must pass options.portal
  // as a base portal url (e.g., www.arcgis.com, qaext.arcgis.com, etc)
  // **not** an org portal (i.e. org.maps.arcgis.com).
  const basePortalUrl = `${getPortalBaseFromOrgUrl(orgPortalUrl)}/sharing/rest`;
  return getPortal(orgId, { ...options, portal: basePortalUrl });
}
