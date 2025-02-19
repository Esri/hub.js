import { IRequestOptions } from "@esri/arcgis-rest-request";
import { IHubOrganization } from "../core/types/IHubOrganization";
import { fetchOrg } from "./fetch-org";
import { IPortal } from "@esri/arcgis-rest-portal";
import { getOrgThumbnailUrl } from "../resources";
import { UserSession } from "@esri/arcgis-rest-auth";

/**
 * Fetch an organization from the portal
 * Note: IHubOrganization is a read-only interface for a subset of the IPortal object
 * The full portal is exposed as the `portal` property on the IHubOrganization object.
 * @param identifier
 * @param requestOptions
 * @returns
 */
export async function fetchOrganization(
  identifier: string,
  requestOptions: IRequestOptions
): Promise<IHubOrganization> {
  const portal = await fetchOrg(identifier, requestOptions);

  const session = requestOptions.authentication as UserSession;
  const token = session.token;
  return portalToOrganization(portal, token);
}

/**
 * Convert an IPortal to an IHubOrganization
 * @param portal
 * @param token
 * @returns
 */
export function portalToOrganization(
  portal: IPortal,
  token?: string
): IHubOrganization {
  let portalUrl = `https://${portal.portalHostname}`;
  if (portal.urlKey) {
    portalUrl = `https://${portal.urlKey}.${portal.customBaseUrl}`;
  }
  return {
    id: portal.id,
    orgId: portal.id,
    access: portal.access,
    name: portal.name,
    summary: portal.description,
    description: portal.description,
    type: "Organization",
    source: "portal",
    createdDate: new Date(portal.created),
    createdDateSource: "portal",
    updatedDate: new Date(portal.modified),
    updatedDateSource: "portal",
    portal,
    thumbnail: portal.thumbnail,
    thumbnailUrl: getOrgThumbnailUrl(portal, token),
    url: portalUrl,
    // Props needed to be a HubEntity, but which don't apply to a portal
    typeKeywords: [],
    tags: [],
  };
}
