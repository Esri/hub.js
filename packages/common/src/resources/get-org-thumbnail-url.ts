import { IPortal } from "@esri/arcgis-rest-portal";
import { getPortalUrl } from "../urls/get-portal-url";

/**
 * Construct a the full url to a portal thumbnail
 *
 * - If the portal has a thumbnail, construct the full url
 * - If the portal is not public, append on the token
 * @param portal
 * @param token
 * @returns
 */
export function getOrgThumbnailUrl(portal: IPortal, token?: string): string {
  let thumbnailUrl = null;
  if (portal?.thumbnail) {
    const portalUrl = getPortalUrl(portal);
    thumbnailUrl = `${portalUrl}/sharing/rest/portals/${portal.id}/resources/${portal.thumbnail}`;
    if (token && portal.access !== "public") {
      thumbnailUrl = `${thumbnailUrl}?token=${token}`;
    }
  }
  return thumbnailUrl;
}
