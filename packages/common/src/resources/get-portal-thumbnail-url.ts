import { IPortal } from "@esri/arcgis-rest-portal";

/**
 * Construct a the full url to a portal thumbnail
 *
 * - If the portal has a thumbnail, construct the full url
 * - If the portal is not public, append on the token
 * @param portalUrl
 * @param portal
 * @param token
 * @returns
 */
export function getPortalThumbnailUrl(
  portalUrl: string,
  portal: IPortal,
  token?: string
): string {
  let thumbnailUrl = null;
  if (portal?.thumbnail) {
    thumbnailUrl = `${portalUrl}/portals/self/resources/${portal.thumbnail}`;
    if (token && portal.access !== "public") {
      thumbnailUrl = `${thumbnailUrl}?token=${token}`;
    }
  }
  return thumbnailUrl;
}
