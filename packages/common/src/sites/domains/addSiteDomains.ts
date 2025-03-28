import { getProp } from "../../objects";
import { IHubRequestOptions, IModel } from "../../hub-types";
import { addDomain } from "./add-domain";

/**
 * Given a Site Model, register the domains with the Domain Service.
 *
 * For Portal, this will return a sparse entry that contains just the portal clientKey
 *
 * This should only be used when creating a site. To update domains related
 * to a site, use the `addDomain` and `removeDomain` functions directly
 *
 * @param {Object} model site model
 * @param {IHubRequestOptions} hubRequestOptions
 */
export function addSiteDomains(
  model: IModel,
  hubRequestOptions: IHubRequestOptions
): Promise<any[]> {
  if (hubRequestOptions.isPortal) {
    // For enterprise we don't register the domain, but we do return a sparse entry
    // that contains just the portal clientKey so that the caller can use it.
    return Promise.resolve([{ clientKey: "arcgisonline" }]);
  } else {
    const props = ["defaultHostname", "customHostname"];
    return Promise.all(
      props.reduce((acc, prop) => {
        const hostname = getProp(model, `data.values.${prop}`);
        if (hostname) {
          const domainOpts = {
            hostname,
            clientKey: model.data.values.clientId,
            orgId: hubRequestOptions.portalSelf.id,
            orgTitle: hubRequestOptions.portalSelf.name,
            orgKey: hubRequestOptions.portalSelf.urlKey,
            siteId: model.item.id,
            siteTitle: model.item.title,
            sslOnly: true,
          };
          acc.push(addDomain(domainOpts, hubRequestOptions));
        }
        return acc;
      }, [] as Array<Promise<any>>)
    );
  }
}
