import {
  EntityType,
  IHubCatalog,
  IPredicate,
  IQuery,
} from "../search/types/IHubCatalog";
import { IContainsOptions, IContainsResponse } from "../search/types/types";
import { isCuid } from "../utils/is-cuid";
import { isGuid } from "../utils/is-guid";
import { IArcGISContext } from "../ArcGISContext";
import { hubSearch } from "../search/hubSearch";
import { getWithDefault } from "../objects/get-with-default";
import { IHubSearchResponse } from "../search/types/IHubSearchResponse";
import { IHubSearchResult } from "../search/types/IHubSearchResult";

/**
 * Given an identifier and a catalog, check if the catalog contains the identifier.
 * Optionally, pass in the
 * @param identifier
 * @param catalog
 * @param options
 */
export async function catalogContains(
  identifier: string,
  catalog: IHubCatalog,
  context: IArcGISContext,
  options: IContainsOptions = {}
): Promise<IContainsResponse> {
  // construct a default response
  const response: IContainsResponse = {
    identifier,
    isContained: false,
    // no need to return the catalogInfo
    // in this function.
  };

  // construct the predicate
  // if the identifier is a guid or cuid, use it as the id,
  // otherwise use it as a slug
  const pred: IPredicate =
    isGuid(identifier) || isCuid(identifier)
      ? { id: identifier }
      : { typekeywords: `slug|${identifier}` };

  // build the queries based on the entityType and the predicate
  const queries = buildQueries(catalog, options.entityType, pred);

  // if no collections or scope for this entity type,
  // then it must not be in the catalog
  if (queries.length === 0) {
    return Promise.resolve(response);
  }

  const results = await executeQueries(queries, catalog, context);

  // if any of the queries returned a result,
  // then the entity is contained
  response.isContained = checkResults(results, pred);

  return response;
}

/**
 * Build queries, if entityType is provided, build queries for
 * that entityType, otherwise build queries for all scopes
 * @param catalog
 * @param entityType
 * @param pred
 * @returns
 */
function buildQueries(
  catalog: IHubCatalog,
  entityType: EntityType,
  pred: IPredicate
): IQuery[] {
  return entityType
    ? buildQueriesForEntityType(catalog, entityType, pred)
    : buildQueriesForAllScopes(catalog, pred);
}

/**
 * Build the queries based on the scope for the entity type,
 * then check any collections that match the entity type,
 * if there are no scopes or collections with the entity type,
 * then the entity is not contained in the catalog
 * @param catalog
 * @param entityType
 * @param pred
 * @returns
 */
function buildQueriesForEntityType(
  catalog: IHubCatalog,
  entityType: EntityType,
  pred: IPredicate
): IQuery[] {
  const queries = [];
  if (catalog.scopes?.[entityType]) {
    // Scope is a "bounding query" for all collections involving the entity type
    // so we can check if it's in the catalog by checking if it's in the scope
    queries.push({
      targetEntity: entityType,
      filters: [{ predicates: [pred] }],
    });
  } else {
    // If there is no scope for the entity type, we check the collections
    const collections = catalog.collections || [];
    const typeCollections = collections.filter(
      (c) => c.targetEntity === entityType
    );
    if (typeCollections.length) {
      // If there are collections for the entity type, we check them
      typeCollections.forEach((collection) => {
        queries.push({
          targetEntity: collection.targetEntity,
          filters: [{ predicates: [pred] }, ...collection.scope.filters],
        });
      });
    }
  }
  return queries;
}

function buildQueriesForAllScopes(
  catalog: IHubCatalog,
  pred: IPredicate
): IQuery[] {
  return Object.keys(catalog.scopes).map((type) => ({
    targetEntity: type as EntityType,
    filters: [{ predicates: [pred] }],
  }));
}

async function executeQueries(
  queries: IQuery[],
  catalog: IHubCatalog,
  context: IArcGISContext
): Promise<Array<IHubSearchResponse<IHubSearchResult>>> {
  return Promise.all(
    queries.map((query) => {
      // get the scope if it exists and merge filters
      if (catalog.scopes[query.targetEntity]) {
        query.filters = [
          ...query.filters,
          ...catalog.scopes[query.targetEntity].filters,
        ];
      }
      // We set num to be 10 to account for api not doing
      // exact matching on slugs
      return hubSearch(query, {
        targetEntity: query.targetEntity,
        num: 10,
        requestOptions: context.hubRequestOptions,
      });
    })
  );
}

/**
 * Check if the results contain the entity based on the predicate
 * @param results
 * @param pred
 * @returns
 */
function checkResults(
  results: Array<IHubSearchResponse<IHubSearchResult>>,
  pred: IPredicate
): boolean {
  return results.reduce((isContained, queryResponse) => {
    if (queryResponse.results.length) {
      if (pred.id) {
        return true;
      } else {
        // slug based search, which is not exact,
        // so we manually verify the exact slug matches
        return queryResponse.results.reduce((slugKeywordPresent, entry) => {
          // try .keywords, then rawResult.typeKeywords, else empty array
          const kwds = getWithDefault(
            entry,
            "typeKeywords",
            getWithDefault(entry, "rawResult.typeKeywords", [])
          );
          // if (kwds.includes(pred.typekeywords)) {
          //   slugKeywordPresent = true;
          // }
          if (entry.typeKeywords.includes(pred.typekeywords)) {
            slugKeywordPresent = true;
          }
          return slugKeywordPresent;
        }, false as boolean);
      }
    }
  }, false as boolean);
}
