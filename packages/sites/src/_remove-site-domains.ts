import { IHubRequestOptions, removeDomainsBySiteId } from "@esri/hub-common";

/**
 * Remove the domain entries for a site
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
  }

  return removeDomainsBySiteId(siteId, hubRequestOptions).then(
    (response) => response
  );
}
