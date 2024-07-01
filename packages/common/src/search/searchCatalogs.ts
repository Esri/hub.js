import { IArcGISContext } from "../ArcGISContext";
import { Catalog } from "./Catalog";
import {
  ICatalogSearchResponse,
  IHubCatalog,
  IPagingOptions,
  IQuery,
  ISortOptions,
} from "./types";

/**
 * Given an array of catalog json objects, execute a search on all the catalogs
 * If passed an IQuery, only collections using the same targetEntity will be searched
 * If passed a string, a query will be executed on all collections in all catalogs
 * @param catalogs
 * @param query
 * @param options
 * @param context
 * @returns
 */

export async function searchCatalogs(
  catalogs: IHubCatalog[],
  query: string | IQuery,
  options: IPagingOptions & ISortOptions,
  context: IArcGISContext
): Promise<ICatalogSearchResponse[]> {
  // instantiate Catalog instances
  const instances = catalogs.map((catalog) =>
    Catalog.fromJson(catalog, context)
  );
  // execute search on all collections in all catalogs
  // TODO: What if there are no collections in the catalog?
  const promises = instances.map(async (cat) => {
    return cat.searchCollections(query, options).then((response) => {
      return {
        catalogTitle: cat.title,
        collectionResults: response,
      } as ICatalogSearchResponse;
    });
  });

  const responses = await Promise.all(promises);

  return responses;
}
