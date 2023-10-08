import {
  IModel,
  IHubRequestOptions,
  _getHttpAndHttpsUris,
  includes,
} from "@esri/hub-common";
import {
  getDomainsForSite,
  IDomainEntry,
  removeDomain,
  addDomain,
} from "@esri/hub-common";
/**
 * Update the list of valid uris associated with the Site item
 * @param {Object} site Site Model
 * @param {Array} uris Array of valid uris for the site
 * @param {IHubRequestOptions} hubRequestOptions
 */
export function updateSiteApplicationUris(
  site: IModel,
  uris: string[],
  hubRequestOptions: IHubRequestOptions
) {
  if (hubRequestOptions.isPortal) return Promise.resolve({});

  // Domain service handles updating the app redirect uris for sites
  // First, get the domain records associated with the site
  return getDomainsForSite(site.item.id, hubRequestOptions).then(
    (domainInfos: IDomainEntry[]) => {
      // get all domains that are no longer associated with the site
      const domainsToRemove = domainInfos.filter(
        (domain) => !includes(uris, domain.hostname)
      );
      // get all new domains that are now associated with the site
      const hostnames = domainInfos.map((domain) => domain.hostname);
      const domainsToAdd = uris.filter((uri) => !includes(hostnames, uri));
      // finally, kick all the promises
      const domainPromises: Array<Promise<any>> = [];
      domainsToRemove.forEach((domain) =>
        domainPromises.push(removeDomain(domain.id, hubRequestOptions))
      );

      domainsToAdd.forEach((uri) =>
        domainPromises.push(
          addDomain(
            {
              orgKey: hubRequestOptions.portalSelf.urlKey,
              orgId: hubRequestOptions.portalSelf.id,
              orgTitle: hubRequestOptions.portalSelf.name,
              hostname: uri,
              siteId: site.item.id,
              siteTitle: site.item.title,
              clientKey: site.data.values.clientId,
              sslOnly: domainInfos[0] ? !!domainInfos[0].sslOnly : true,
            },
            hubRequestOptions
          )
        )
      );
      return Promise.all(domainPromises);
    }
  );
}
