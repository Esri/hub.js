import { UserSession } from "@esri/arcgis-rest-auth";
import { IAggregationResult } from "../util/aggregations/merge-aggregations";
import {
  IDateRange,
  SortDirection,
  ISearchRequest,
  ISearchResponse
} from "./common";

/**
 * Defines an enum for common booleans used to create a search filter
 */
export enum IBooleanOperator {
  AND = "AND",
  OR = "OR",
  NOT = "NOT"
}

/**
 * Defines a generic filter interface for creating a granular searcg filter
 * value - generic value of filters that could be combined
 * bool - the IBooleanOperator used to combine the filters
 */
export interface IFieldFilter<T> {
  value: T;
  bool?: IBooleanOperator;
}

/**
 * The IContentFieldFilter extends the IFieldFilter by parameterizing the value
 * to be a string array
 */
export interface IContentFieldFilter extends IFieldFilter<string[]> {}

/**
 * Defines the interface for filtering content as part of a content search request
 * Properties correspond to their Portal API equivalents
 */
export interface IContentSearchFilter {
  terms?: string;
  id?: string | string[] | IContentFieldFilter;
  owner?: string | string[] | IContentFieldFilter;
  created?: IDateRange<number>;
  modified?: IDateRange<number>;
  title?: string | string[] | IContentFieldFilter;
  typekeywords?: string | string[] | IContentFieldFilter;
  description?: string | string[] | IContentFieldFilter;
  tags?: string | string[] | IContentFieldFilter;
  orgid?: string | string[] | IContentFieldFilter;
  type?: string | string[] | IContentFieldFilter;
  access?: string | string[] | IContentFieldFilter;
  accessinformation?: string | string[] | IContentFieldFilter;
  group?: string | string[] | IContentFieldFilter;
  culture?: string | string[] | IContentFieldFilter;
  categories?: string | string[] | IContentFieldFilter;
  [key: string]: string | string[] | IDateRange<number> | IContentFieldFilter;
}

/**
 * Defines the interface for search options as part of a content search request
 * Properties correspond to their Portal API or arcgis-rest-js equivalents
 */
export interface IContentSearchOptions {
  authentication?: UserSession;
  portal?: string;
  isPortal?: boolean;
  sortField?: string;
  sortOrder?: SortDirection;
  page?: string;
  aggregations?: string;
  bbox?: string;
  fields?: string;
}

/**
 * Defines the interface for a content search request by parameterizing the
 * generic search request with the IContentSearchFilter and IContentSearchOptions
 * interfaces
 */
export interface IContentSearchRequest
  extends ISearchRequest<IContentSearchFilter, IContentSearchOptions> {}

/**
 * Defines the interface format for Aggregations returned from the content search
 */
export interface IContentAggregations {
  counts: IAggregationResult[];
}

/**
 * Defines the interface format for content searches by extending ISearchResponse with
 * a parameterized results list type of any. Includes query, paginated result count,
 * and aggregations
 */
export interface IContentSearchResponse extends ISearchResponse<any> {
  query: string;
  count: number;
  aggregations?: IContentAggregations;
}
