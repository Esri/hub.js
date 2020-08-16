import { IPortal } from "@esri/arcgis-rest-portal";

/**
 * Return the Portal url based on the portal self
 * @param {Object} urlOrObject a Portal API URL, request options object, or Portal self object
 */
export function getPortalUrl(portalOrUrl: IPortal | string): string {
  if (typeof portalOrUrl === "string") {
    // assume this is the URL of the Portal API, strip the `/sharing/rest`
    return portalOrUrl.replace(/\/sharing\/rest\/?$/, "");
  }
  // this is a Portal self object
  const portal = portalOrUrl;
  if (portal.isPortal) {
    return `https://${portal.portalHostname}`;
  } else {
    return `https://${portal.urlKey}.${portal.customBaseUrl}`;
  }
}
