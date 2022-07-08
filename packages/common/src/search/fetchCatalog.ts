import { getItemData } from "@esri/arcgis-rest-portal";
import HubError from "../HubError";
import { lookupDomain } from "../sites/domains/lookup-domain";
import { IHubRequestOptions } from "../types";
import { stripProtocol } from "../urls/strip-protocol";
import { isGuid } from "../utils/is-guid";
import { IHubCatalog } from "./types/IHubCatalog";
import { upgradeCatalogSchema } from "./upgradeCatalogSchema";

/**
 * Fetch a IHubCatalog from a backing item.
 * This will apply schema upgrades to the structure
 * @param identifier
 * @param requestOptions
 * @returns
 */
export async function fetchCatalog(
  identifier: string,
  requestOptions: IHubRequestOptions
): Promise<IHubCatalog> {
  let getPrms;
  // identifier can be a guid or a url
  if (identifier.indexOf("http") === 0) {
    let url = identifier;

    // get down the the hostname
    url = stripProtocol(url);
    // if url does not include a hash (i.e. it's not portal)
    // then we want to split on the first slash to get the hostname
    // lookupDomain will handle the enterprise base urls
    if (!url.includes("#")) {
      url = url.split("/")[0];
    }

    getPrms = lookupDomain(url, requestOptions)
      // get the item's data, and read the catalog out of it
      .then(({ siteId }) => getItemData(siteId, requestOptions))
      .then((data) => {
        return upgradeCatalogSchema(data.catalog || {});
      });
  } else if (isGuid(identifier)) {
    // get the item's data, and read the catalog out of it
    getPrms = getItemData(identifier, requestOptions).then((data) => {
      return upgradeCatalogSchema(data.catalog || {});
    });
  } else {
    throw new HubError("Catalog.create", "Identifier must be a url, guid");
  }

  const fetched = await getPrms;

  return fetched;
}
