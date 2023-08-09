import { IRequestOptions } from "@esri/arcgis-rest-request";
import { IFilter, IPredicate, IQuery } from "./types";
import { expandQuery } from "./_internal/portalSearchItems";
import { cloneObject } from "../util";
import { explainFilter } from "./_internal/explainFilter";

export interface IQueryExplanation {
  result: GenericResult;
  query: IQuery;
  matched: boolean;
  reasons: IFilterExplanation[];
  summary: IMatchReason[];
}

export interface IQueryExplanationDetails {
  value: string;
  description: string;
  details: [];
}

export interface IFilterExplanation {
  filter: IFilter;
  matched: boolean;
  reasons: IPredicateExplanation[];
}

export interface IPredicateExplanation {
  predicate: IPredicate;
  matched: boolean;
  reasons: IMatchReason[];
  meta?: Record<string, any>;
}

export type MatchCondition = "IN" | "NOT_IN" | "ALL";

/**
 * Reason why a result matched a query
 */
export interface IMatchReason {
  attribute: string;
  values?: string;
  condition?: MatchCondition; // EQ | NE | IN | NOT_IN | GT | LT | GTE | LTE | BETWEEN | NOT_BETWEEN | LIKE | NOT_LIKE | IS | IS_NOT | CONTAINS | NOT_CONTAINS | STARTS_WITH | ENDS_WITH | NOT_STARTS_WITH | NOT_ENDS_WITH | NOT_NULL | IS_NULL | NOT_EMPTY | IS_EMPTY | NOT_IN | NOT_BETWEEN | NOT_LIKE | NOT_CONTAINS | NOT_STARTS_WITH | NOT_ENDS_WITH | NOT_NULL | IS_NOT | IS_EMPTY;
  matched: boolean;
  requirement?: string;
  message?: string;
  meta?: Record<string, any>;
}

/**
 * Wide type allowing any object to be passed in as a result
 */
export type GenericResult = Record<string, any>;

/**
 * Explain why a specific result was included in a Query.
 *
 * NOTE: This only works for entityType: "item" queries and does not
 * cover all possible permutations.
 *
 * This will be exposed as functions that work with catalogs, or collections
 * but in either case, those will boild down to an IQuery, so this is the
 * actual implementation
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
  const expandedQuery = expandQuery(query);

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
