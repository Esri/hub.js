import { IArcGISContext } from "../ArcGISContext";
import { Catalog } from "./Catalog";
import {
  ICatalogSearchResponse,
  IHubCatalog,
  IPagingOptions,
  IQuery,
  ISearchResponseHash,
  ISortOptions,
} from "./types";
import { setProp } from "../objects/set-prop";

/**
 * Given an array of catalog json objects, execute a search on all the collections
 * in all the catalogs. If a scope exists without any associated collections in the catalog,
 * the scope will be searched as well.
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

  // Beheavior:
  // Query all the collections in all the catalogs
  // if there is a scope which does not have a collection, query the scope
  const promises = instances.map(async (cat) => {
    // search the collections
    const collectionPromise = cat
      .searchCollections(query, options)
      .then((response) => {
        return {
          catalogTitle: cat.title,
          collectionResults: response,
        } as ICatalogSearchResponse;
      });
    const promiseArray = [collectionPromise];
    // for this catalog, find any scopes that do not have a collection
    const collectionTargets = cat.collections
      .map((collection) => collection.targetEntity)
      .filter((v, i, self) => self.indexOf(v));

    // find the scopes that are not in the collectionTargets
    const scopesToQuery = cat.availableScopes.filter(
      (scope) => !collectionTargets.includes(scope)
    );
    // if there are scopes to query, query them
    if (scopesToQuery.length) {
      const scopePromise = cat
        .searchScopes(query, options, scopesToQuery)
        .then((response) => {
          // convert the response to a hash
          return {
            catalogTitle: cat.title,
            scopeResults: response,
          } as ICatalogSearchResponse;
        });
      promiseArray.push(scopePromise);
    }
    return await Promise.all(promiseArray).then((responses) => {
      // merge into a single response
      return responses.reduce((acc, response) => {
        return {
          catalogTitle: response.catalogTitle,
          collectionResults: {
            ...acc.collectionResults,
            ...response.collectionResults,
          },
          scopeResults: {
            ...acc.scopeResults,
            ...response.scopeResults,
          },
        } as ICatalogSearchResponse;
      }, {} as ICatalogSearchResponse);
    });
  });
  // return the results
  // each catalog will have a single ICatalogSearchResponse
  return Promise.all(promises);
}
