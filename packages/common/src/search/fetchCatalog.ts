import { getItemData } from "@esri/arcgis-rest-portal";
import HubError from "../HubError";
import { lookupDomain } from "../sites/domains/lookup-domain";
import { IHubRequestOptions } from "../types";
import { stripProtocol } from "../urls/strip-protocol";
import { isGuid } from "../utils/is-guid";
import { IHubCatalog } from "./types/IHubCatalog";
import { upgradeCatalogSchema } from "./upgradeCatalogSchema";
import { HubEntityType } from "../core/types/HubEntityType";

/**
 * @deprecated
 * NOTE: This assumes the catalog is stored at item.data.catalog and does not handle
 * events or other entities that may have a catalog.
 * -----------------------------------
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

    // TODO: get the entity so the catalog migrations / mappings can be applied
    // however this requires the HubEntityType and context, which we don't have
    getPrms = getItemData(identifier, requestOptions).then((data) => {
      // catalogs are moving to an array structure so we need to handle both
      let catalog = {};
      if (data.catalog) {
        catalog = data.catalog;
      }
      if (data.catalogs && data.catalogs.length > 0) {
        catalog = data.catalogs[0];
      }

      return upgradeCatalogSchema(catalog);
    });
  } else {
    throw new HubError("fetchCatalog", "Identifier must be a url, guid");
  }

  const fetched = await getPrms;

  return fetched;
}
