import { getItem } from "@esri/arcgis-rest-portal";
import { IArcGISContext, IHubCatalog } from "../..";
import { getHubTypeFromItemType, fetchHubEntity } from "../../core";
import { fetchEvent } from "../../events";
import HubError from "../../HubError";
import { getProp } from "../../objects";
import { lookupDomain, fetchSite } from "../../sites";
import { stripProtocol } from "../../urls";
import { isGuid, isCuid } from "../../utils";
import { get } from "http";

/**
 * @internal
 * Fetch a IHubCatalog for an entity.
 * Internal because it's designed to be used in a place where
 * we don't have the Hub Entity Type, so we have to do acrobatics
 * to fetch the item, get the type, and then fetch the entity.
 * We do all this so the type specific catalog migrations / mappings
 * can be applied.
 * @param identifier
 * @param context
 * @returns
 */
export async function fetchEntityCatalog(
  identifier: string,
  context: IArcGISContext,
  options?: {
    prop: string;
  }
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

    getPrms = lookupDomain(url, context.hubRequestOptions)
      .then(({ siteId }) => fetchSite(siteId, context.hubRequestOptions))
      .then((site) => {
        return site.catalog;
      });
  } else if (isGuid(identifier)) {
    // get the entity, use that to get the type, and then get the entity
    // and return the catalog
    getPrms = getItem(identifier, context.requestOptions)
      .then((item) => {
        // convert the item type into a hub entity type
        const entityType = getHubTypeFromItemType(item.type);
        return fetchHubEntity(entityType, identifier, context);
      })
      .then((entity) => {
        // If we have a catalog prop, use that
        let catalog = getProp(
          entity,
          options?.prop || "catalog"
        ) as IHubCatalog;
        // If we have a catalogs, grab the first one from the array
        const catalogs = getProp(entity, "catalogs") as IHubCatalog[];
        if (catalogs && catalogs.length > 0) {
          catalog = catalogs[0];
        }
        return catalog;
      });
  } else if (isCuid(identifier)) {
    // get the entity, use that to get the type, and then get the entity
    // and return the catalog
    getPrms = fetchEvent(identifier, context.hubRequestOptions).then(
      (entity) => {
        // TODO: Change events back to having a single catalog property
        return entity.catalogs[0];
      }
    );
  } else {
    throw new HubError("Catalog.init", "Identifier must be a url, guid");
  }

  const fetched = await getPrms;

  return fetched;
}
