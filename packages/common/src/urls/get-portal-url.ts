import { IRequestOptions } from "@esri/arcgis-rest-request";
import {
  IPortal,
  getPortalUrl as getPortalApiUrl
} from "@esri/arcgis-rest-portal";
import { IHubRequestOptions } from "../types";

/**
 * Derive a portal's base URL from the portal's API URL, a portal object, or request options
 * @param urlOrObject a portal API URL, a portal object, or request options containing either of those
 * @returns The portal base URL, defaults to `https://www.arcgis.com`
 */
export function getPortalUrl(
  urlOrObject?: string | IPortal | IHubRequestOptions | IRequestOptions
): string {
  if (typeof urlOrObject === "string") {
    // assume this is the URL of the portal API
    // and strip the `/sharing/rest`
    return urlOrObject.replace(/\/sharing\/rest\/?$/, "");
  }

  if (typeof urlOrObject === "object") {
    // build URL from portal self object, which could be
    // either a property of the object (request options) or the object itself
    const portalSelf = (urlOrObject as IHubRequestOptions).portalSelf;
    const portal = portalSelf || (urlOrObject as IPortal);
    const { portalHostname, urlKey, customBaseUrl } = portal;
    if (portalHostname || (urlKey && customBaseUrl)) {
      // user passed in a portal object, we'll use that to build the URL
      if (portal.isPortal) {
        return `https://${portal.portalHostname}`;
      } else {
        return `https://${portal.urlKey}.${portal.customBaseUrl}`;
      }
    }
  }

  // urlOrObj is either undefined, or a request options w/o portal self
  // get portal API URL and parse portal URL from that
  return getPortalUrl(getPortalApiUrl(urlOrObject as IRequestOptions));
}
