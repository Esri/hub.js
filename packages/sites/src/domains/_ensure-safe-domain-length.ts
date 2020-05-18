import { cloneObject, generateRandomString } from "@esri/hub-common";

/**
 * Ensure that a subdomain is not greater than 63 characters in length
 * Subdomains are prep-ended on the org's url key, and the combined
 * length can not exceed 63 chars as per rules of domains.
 * If the requested subdomain + the url key is > 63 chars, we
 * strip off the last 6 chars and replace that w/ random characeters
 * This was an actual reported bug.
 * @param {String} subdomain Proposed subdomain
 * @param {String} urlKey Org url key
 */
export function _ensureSafeDomainLength(subdomain: string, urlKey?: string) {
  let result = cloneObject(subdomain);
  let max = 63;
  if (urlKey) max = max - (urlKey.length + 1);
  if (result.length > max) {
    result = `${result.slice(0, max - 6)}-${generateRandomString(5)}`;
  }
  return result;
}
