import { getItem } from "@esri/arcgis-rest-portal";
import { fetchEvent } from "../events/fetch";
import HubError from "../HubError";
import { getProp } from "../objects";
import { fetchSite } from "../sites/HubSites";
import { stripProtocol } from "../urls";
import { isGuid, isCuid } from "../utils";
import type { IArcGISContext } from "../types/IArcGISContext";
import { IHubCatalog } from "./types/IHubCatalog";
import { lookupDomain } from "../sites/domains/lookup-domain";
import { HubEntityType } from "../core/types/HubEntityType";
import { getHubTypeFromItemType } from "../core/getHubTypeFromItemType";
import { fetchHubEntity } from "../core/fetchHubEntity";

/**
 * Fetch a Catalog for an entity.
 * This function fetches the entity and returns the `.catalog` property
 * However, other properties can be fetched by passing the name of the property
 * in the `prop` option.
 * Additionally, passing the `hubEntityType` option provide a performance boost
 * by skipping the fetch of the backing Item, then fetching the entity.
 * @param identifier
 * @param context
 * @param options { hubEntityType?: string; prop: string }
 * @returns
 */
export async function fetchEntityCatalog(
  identifier: string,
  context: IArcGISContext,
  options?: {
    hubEntityType?: string; // if provided, will fetch the entity and get the catalog from it
    prop: string; // property to get the catalog from defaults to "catalog" if not provided
  }
): Promise<IHubCatalog> {
  let catalog: IHubCatalog;

  // identifier can be a guid or a url
  if (identifier.indexOf("http") === 0) {
    // Handle Sites via Url
    let url = identifier;

    // get down the the hostname
    url = stripProtocol(url);
    // if url does not include a hash (i.e. it's not portal)
    // then we want to split on the first slash to get the hostname
    // lookupDomain will handle the enterprise base urls
    if (!url.includes("#")) {
      url = url.split("/")[0];
    }

    const domainEntry = await lookupDomain(url, context.hubRequestOptions);
    const site = await fetchSite(domainEntry.siteId, context.hubRequestOptions);
    catalog = getProp(site, options?.prop || "catalog") as IHubCatalog;
  } else if (isGuid(identifier)) {
    // Handle Item Backed entities
    let entityType: HubEntityType;
    if (options?.hubEntityType) {
      entityType = options.hubEntityType as HubEntityType;
    } else {
      const item = await getItem(identifier, context.requestOptions);
      entityType = getHubTypeFromItemType(item.type);
    }
    const entity = await fetchHubEntity(entityType, identifier, context);
    catalog = getProp(entity, options?.prop || "catalog") as IHubCatalog;
  } else if (isCuid(identifier)) {
    // get the entity, use that to get the type, and then get the entity
    // and return the catalog
    const event = await fetchEvent(identifier, context.hubRequestOptions);
    catalog = getProp(event, options?.prop || "catalog") as IHubCatalog;
  } else {
    throw new HubError(
      "Catalog.init",
      "Identifier must be a url, item or event id"
    );
  }

  return catalog;
}
