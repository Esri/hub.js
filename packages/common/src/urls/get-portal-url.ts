import { IRequestOptions } from "@esri/arcgis-rest-request";
import {
  IPortal,
  getPortalUrl as getPortalApiUrl
} from "@esri/arcgis-rest-portal";
import { IHubRequestOptions } from "../types";

/**
 * Return the Portal url based on the portal self
 * @param urlOrObject a Portal API URL, request options object, or Portal self object
 */
export function getPortalUrl(
  urlOrObject: IPortal | IHubRequestOptions | IRequestOptions | string
): string {
  if (typeof urlOrObject === "string") {
    // assume this is the URL of the Portal API
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
