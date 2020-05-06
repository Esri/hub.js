import { IHubRequestOptions } from "@esri/hub-common";
import { lookupDomain } from "./lookup-domain";

/**
 * Check to see if a domain is in use by any site other than the
 * one passed in. This is used in various validators while the
 * user is editing properties of the site.
 * @param {string} domain Domain to check
 * @param {string} siteId Site Id we are checking for
 * @param {IHubRequestOptions} hubRequestOptions
 */
export function isDomainUsedElsewhere(
  domain: string,
  siteId: string,
  hubRequestOptions: IHubRequestOptions
) {
  return lookupDomain(domain, hubRequestOptions)
    .then(domainEntry => {
      return domainEntry.siteId !== siteId;
    })
    .catch(() => {
      // domain entry not found, ergo not used on another site
      return false;
    });
}
