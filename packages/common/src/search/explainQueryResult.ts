import { IRequestOptions } from "@esri/arcgis-rest-request";
import { cloneObject } from "../util";
import { explainFilter } from "./_internal/explainFilter";
import { expandPortalQuery } from "./utils";
import { IQuery } from "./types/IHubCatalog";
import {
  GenericResult,
  IQueryExplanation,
  IFilterExplanation,
  IMatchReason,
} from "./types/types";

/**
 * Explain why a specific result was included in a Query.
 *
 * NOTE: This only works for entityType: "item" queries and does not
 * cover all possible permutations.
 * @param queryResult
 * @param query
 * @param requestOptions
 * @returns
 */
export async function explainQueryResult(
  queryResult: GenericResult,
  query: IQuery,
  requestOptions: IRequestOptions
): Promise<IQueryExplanation> {
  // Throw if the query is not for items
  if (query.targetEntity !== "item") {
    throw new Error(
      `explainQueryResult: Only queries with targetEntity: "item" are supported`
    );
  }

  // Expand the query so we have a standardized structure to work with
  const expandedQuery = expandPortalQuery(query);

  // iterate the filters on the query and get explanations for each
  const filterExplanations: IFilterExplanation[] = [];
  for (const filter of expandedQuery.filters) {
    const fe = await explainFilter(filter, queryResult, requestOptions);
    filterExplanations.push(fe);
  }

  // Collect up the reasons
  const included = filterExplanations.reduce((acc, explanation) => {
    if (!explanation.matched) {
      acc = false;
    }
    return acc;
  }, true);

  // Collect up all the reasons into a single array
  const summary: IMatchReason[] = [];
  filterExplanations.forEach((fe) => {
    fe.reasons.forEach((predicateExplanation) => {
      predicateExplanation.reasons.forEach((reason) => {
        summary.push(reason);
      });
    });
  });

  // construct the result
  const result: IQueryExplanation = {
    result: cloneObject(queryResult),
    query: cloneObject(query),
    matched: included,
    reasons: filterExplanations,
    summary,
  };

  return result;
}
