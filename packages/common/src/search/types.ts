import { IQuery, IFilter, IPredicate } from "./types/IHubCatalog";

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
