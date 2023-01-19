import { getProp } from "../../objects";
import { IDomainEntry, IHubRequestOptions, IModel } from "../../types";
import { addDomain, removeDomainByHostname } from "../domains";

/**
 * Given two site models, determine the domain changes and apply them
 * @param currentModel
 * @param updatedModel
 * @param requestOptions
 * @private
 */
export async function handleDomainChanges(
  updatedModel: IModel,
  currentModel: IModel,
  requestOptions: IHubRequestOptions
) {
  const defaultDomainRecord: Partial<IDomainEntry> = {
    clientKey: updatedModel.data.values.clientId,
    orgId: requestOptions.portalSelf.id,
    orgTitle: requestOptions.portalSelf.name,
    orgKey: requestOptions.portalSelf.urlKey,
    siteId: updatedModel.item.id,
    siteTitle: updatedModel.item.title,
    sslOnly: true,
  };

  const domainChanges = {
    remove: [] as string[],
    add: [] as string[],
  };

  ["customHostname", "defaultHostname"].forEach((key) => {
    const currentValue = getProp(currentModel, `data.values.${key}`);
    const updatedValue = getProp(updatedModel, `data.values.${key}`);
    if (updatedValue !== currentValue) {
      domainChanges.remove.push(currentValue);
      domainChanges.add.push(updatedValue);
    }
  });
  const domainChangePromises: Array<Promise<any>> = [];

  // handle additions
  domainChanges.add.map((hostname) => {
    const domainOpts = { ...{ hostname }, ...defaultDomainRecord };
    domainChangePromises.push(addDomain(domainOpts, requestOptions));
  });

  // handle removals
  domainChanges.remove.map((hostname) => {
    domainChangePromises.push(removeDomainByHostname(hostname, requestOptions));
  });

  return Promise.all(domainChangePromises);
  // TODO: Error handling & OperationStack
}
