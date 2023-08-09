import { IRequestOptions } from "@esri/arcgis-rest-request";
import { IFilter, IPredicate, IQuery } from "./types";
import { expandQuery } from "./_internal/portalSearchItems";
import { cloneObject } from "../util";
import { explainFilter } from "./_internal/explainFilter";

/**
 * Explanation of why a result matched a query
 */
export interface IQueryExplanation {
  /**
   * Copy of result; Useful when doing bulk calls
   */
  result: GenericResult;
  /**
   * Copy of query; Useful when doing bulk calls
   */
  query: IQuery;
  /**
   * Whether the result matched the query
   */
  matched: boolean;
  /**
   * Array of explanations for each filter
   */
  reasons: IFilterExplanation[];
  /**
   * Summary of all reasons for the result matching the query
   */
  summary: IMatchReason[];
}

export interface IQueryExplanationDetails {
  value: string;
  description: string;
  details: [];
}

/**
 * Explanation of why a filter matched a query
 */
export interface IFilterExplanation {
  /**
   * Copy of the Filter
   */
  filter: IFilter;
  /**
   * Did the filter match the query?
   */
  matched: boolean;
  /**
   * Array of explanations for each predicate in the Filter
   */
  reasons: IPredicateExplanation[];
}

/**
 * Explanation of why a predicate matched a query
 */
export interface IPredicateExplanation {
  /**
   * Copy of the Predicate
   */
  predicate: IPredicate;
  /**
   * Did the predicate match the query?
   */
  matched: boolean;
  /**
   * Array of reasons why the predicate matched the query
   */
  reasons: IMatchReason[];
  /**
   * Additional information about the predicate which can be useful
   * when preparing a UI to display the explanation
   */
  meta?: Record<string, any>;
}

/**
 * Match condition
 */
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
