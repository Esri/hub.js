import {
  EntityType,
  IHubCatalog,
  IPredicate,
} from "../search/types/IHubCatalog";
import { IContainsOptions, IContainsResponse } from "../search/types/types";
import { isCuid } from "../utils/is-cuid";
import { isGuid } from "../utils/is-guid";
import type { IArcGISContext } from "../types/IArcGISContext";
import { hubSearch } from "../search/hubSearch";

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
  const pred: IPredicate = {};

  if (isGuid(identifier) || isCuid(identifier)) {
    pred.id = identifier;
  } else {
    // treat as slug
    pred.typekeywords = `slug|${identifier}`;
  }
  // construct the queries
  const queries = [];
  if (options.entityType) {
    // --------------------------------------------------------
    // Check the scope for the entity type
    // then check any collections that match the entity type
    // if there are no scopes or collections with the entity type
    // then the entity is not contained in the catalog
    // --------------------------------------------------------
    if (catalog.scopes && catalog.scopes[options.entityType]) {
      // Scope is a "bounding query" for all collections involving the entity type
      // so we can check if it's in the catalog by checking if it's in the scope
      queries.push({
        targetEntity: options.entityType,
        filters: [{ predicates: [pred] }],
      });
    } else {
      // If there is no scope for the entity type, we check the collections
      const collections = catalog.collections || [];
      const typeCollections = collections.filter(
        (c) => c.targetEntity === options.entityType
      );
      if (typeCollections.length) {
        // If there are collections for the entity type, we check them
        typeCollections.forEach((collection) => {
          queries.push({
            targetEntity: collection.targetEntity,
            filters: [{ predicates: [pred] }, ...collection.scope.filters],
          });
        });
      } else {
        // no collections or scope for this entity type
        // thus it cannot be in the catalog
        return Promise.resolve(response);
      }
    }
  } else {
    // Construct a query for each scope
    Object.keys(catalog.scopes).forEach((type) => {
      queries.push({
        targetEntity: type as EntityType,
        filters: [{ predicates: [pred] }],
      });
    });
  }

  // execute the queries
  const results = await Promise.all(
    queries.map((query) => {
      // get the scope if it exists and merge filters
      if (catalog.scopes[query.targetEntity]) {
        query.filters = [
          ...query.filters,
          ...catalog.scopes[query.targetEntity].filters,
        ];
      }
      // We set num to be 10 to account for api not doing exact matching on slugs
      return hubSearch(query, {
        targetEntity: query.targetEntity,
        num: 10,
        requestOptions: context.hubRequestOptions,
      });
    })
  );

  // if any of the queries returned a result, then the entity is contained
  response.isContained = results.reduce((isContained, queryResponse) => {
    if (queryResponse.results.length) {
      if (pred.id) {
        isContained = true;
      } else {
        // slug based search, which is not exact,
        // so we manually verify the exact slug matches
        isContained = queryResponse.results.reduce(
          (slugKeywordPresent, entry) => {
            // try .keywords, then rawResult.typeKeywords, else empty array
            // const kwds = getWithDefault(
            //   entry,
            //   "typeKeywords",
            //   getWithDefault(entry, "rawResult.typeKeywords", [])
            // );
            // if (kwds.includes(pred.typekeywords)) {
            //   slugKeywordPresent = true;
            // }
            if (entry.typeKeywords.includes(pred.typekeywords)) {
              slugKeywordPresent = true;
            }
            return slugKeywordPresent;
          },
          false as boolean
        );
      }
    }
    return isContained;
  }, false as boolean);

  return response;
}
