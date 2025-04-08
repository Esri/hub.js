import { IRequestOptions } from "@esri/arcgis-rest-request";
import { IHubOrganization } from "../core/types/IHubOrganization";
import { fetchOrg } from "./fetch-org";
import { IPortal } from "@esri/arcgis-rest-portal";
import { getOrgThumbnailUrl } from "../resources";
import type { ArcGISIdentityManager } from "@esri/arcgis-rest-request";
import { IHubSearchResult } from "../search/types/IHubSearchResult";

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

  const session = requestOptions.authentication as ArcGISIdentityManager;
  const token = session.token;
  return portalToOrganization(portal, token);
}

/**
 * Convert an IPortal to an IHubSearchResult
 * @param portal
 * @returns
 */
export function portalToSearchResult(portal: IPortal): IHubSearchResult {
  const org = portalToOrganization(portal);
  // simple transform
  return {
    id: org.id,
    title: org.name,
    name: org.name,
    url: org.url,
    type: "Organization",
    family: "organization",
    source: "portal",
    createdDate: org.createdDate,
    createdDateSource: org.createdDateSource,
    updatedDate: org.updatedDate,
    updatedDateSource: org.updatedDateSource,
    thumbnailUrl: org.thumbnailUrl,
    thumbnail: org.thumbnail,
    description: org.description,
    access: org.access,
    tags: org.tags,
    typeKeywords: org.typeKeywords,
    links: org.links,
  };
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
    links: {
      self: portalUrl,
      thumbnail: getOrgThumbnailUrl(portal, token),
    },
    // Props needed to be a HubEntity, but which don't apply to a portal
    typeKeywords: [],
    tags: [],
  };
}
