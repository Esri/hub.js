import type { IArcGISContext } from "../types/IArcGISContext";
import { getWithDefault } from "../objects/get-with-default";
import { searchCatalogs } from "./searchCatalogs";
import { HubEntity } from "../core/types/HubEntity";
import { ICatalogSearchResponse } from "./types/ICatalogSearchResponse";
import { IQuery, IHubCatalog } from "./types/IHubCatalog";
import { IPagingOptions, ISortOptions } from "./types/IHubSearchOptions";

/**
 * Given an entity, execute a search on all the catalogs, and their associated with the entity
 * If the entity has no catalogs, an empty array is returned
 * If passed an IQuery, only collections using the same targetEntity will be searched
 * If passed a string, a query will be executed on all collections in all catalogs
 * @param entity
 * @param query - string or IQuery
 * @param options - IPagingOptions & ISortOptions - only num is used
 * @param context
 * @returns
 */
export async function searchEntityCatalogs(
  entity: HubEntity,
  query: string | IQuery,
  options: IPagingOptions & ISortOptions,
  context: IArcGISContext
): Promise<ICatalogSearchResponse[]> {
  // collect all the catalogs from the entity, and search them
  const catalogs = getWithDefault(entity, "catalogs", []) as IHubCatalog[];
  return searchCatalogs(catalogs, query, options, context);
}
