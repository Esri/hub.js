import { IHubRequestOptions } from "../../types";
import { lookupDomain } from "./lookup-domain";

/**
 * Check to see if a domain is in use by any site other than the
 * one passed in. This is used in various validators while the
 * user is editing properties of the site.
 * @param {string} hostname to check
 * @param {string} siteId Site Id we are checking for
 * @param {IHubRequestOptions} hubRequestOptions
 */
export function isDomainUsedElsewhere(
  hostname: string,
  siteId: string,
  hubRequestOptions: IHubRequestOptions
) {
  return lookupDomain(hostname, hubRequestOptions)
    .then((domainEntry) => {
      return domainEntry.siteId !== siteId;
    })
    .catch(() => {
      // domain entry not found, ergo not used on another site
      return false;
    });
}
