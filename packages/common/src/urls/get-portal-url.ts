import { IPortal } from "@esri/arcgis-rest-portal";
import { IHubRequestOptions } from "../types";

/**
 * Return the Portal url based on the portal self
 * @param {Object} urlOrObject a Portal API URL, request options object, or Portal self object
 */
export function getPortalUrl(
  urlOrObj: IPortal | IHubRequestOptions | string
): string {
  if (typeof urlOrObj === "string") {
    // assume this is the URL of the Portal API
    // and strip the `/sharing/rest`
    return urlOrObj.replace(/\/sharing\/rest\/?$/, "");
  }
  // assume this is request options and try to get portal API URL
  const portalApiUrl = urlOrObj.portal;
  if (portalApiUrl) {
    return getPortalUrl(portalApiUrl);
  }
  // build URL from portal self object, which is
  // either a property of the object (request options) or the object itself
  const portalSelf = urlOrObj.portalSelf;
  const portal = portalSelf || urlOrObj;
  if (portal.isPortal) {
    return `https://${portal.portalHostname}`;
  } else {
    return `https://${portal.urlKey}.${portal.customBaseUrl}`;
  }
}
