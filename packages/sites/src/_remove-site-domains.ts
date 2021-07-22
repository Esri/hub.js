import { IHubRequestOptions } from "@esri/hub-common";
import { getDomainsForSite, removeDomain } from "@esri/hub-common";

/**
 * Remove the Domain entries for a Site
 * @param {string} siteId Item Id of the site to remove the domain entries for
 * @param {IHubRequestOptions} hubRequestOptions
 * @private
 */
export function _removeSiteDomains(
  siteId: string,
  hubRequestOptions: IHubRequestOptions
) {
  if (hubRequestOptions.isPortal) {
    return Promise.resolve([]);
  } else {
    return getDomainsForSite(siteId, hubRequestOptions).then((domains) => {
      return Promise.all(
        domains.map((domainEntry) => {
          return removeDomain(domainEntry.id, hubRequestOptions);
        })
      );
    });
  }
}
