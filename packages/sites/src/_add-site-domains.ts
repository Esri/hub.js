import { IHubRequestOptions, IModel, getProp } from "@esri/hub-common";
import { addDomain } from "./domains";

/**
 * Given a Site Model, add the required domains.
 * This should only be called as part of the `createSite` flow
 * @param {Object} model site model
 * @param {IHubRequestOptions} hubRequestOptions
 * @private
 */
export function _addSiteDomains(
  model: IModel,
  hubRequestOptions: IHubRequestOptions
): Promise<any[]> {
  if (hubRequestOptions.isPortal) {
    return Promise.resolve([]);
  } else {
    const props = ["defaultHostname", "customHostname"];
    return Promise.all(
      props.reduce(
        (acc, prop) => {
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
              sslOnly: true
            };
            acc.push(addDomain(domainOpts, hubRequestOptions));
          }
          return acc;
        },
        [] as Array<Promise<any>>
      )
    );
  }
}
