import { UserSession } from "@esri/arcgis-rest-auth";
import { IAggregationResult } from "../util/aggregations/merge-aggregations";
import {
  IDateRange,
  SortDirection,
  ISearchRequest,
  ISearchResponse
} from "./common";

export enum IBooleanOperator {
  AND = "AND",
  OR = "OR",
  NOT = "NOT"
}

export interface IFieldFilter<T> {
  value: T;
  bool?: IBooleanOperator;
}

export interface IContentFieldFilter extends IFieldFilter<string[]> {}

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

export interface IContentSearchOptions {
  authentication?: UserSession;
  portal?: string;
  sortField?: string;
  sortOrder?: SortDirection;
  page?: string;
  aggregations?: string;
  bbox?: string;
  fields?: string;
}

export interface IContentSearchRequest
  extends ISearchRequest<IContentSearchFilter, IContentSearchOptions> {}

export interface IContentAggregations {
  counts: IAggregationResult[];
}

export interface IContentSearchResponse extends ISearchResponse<any> {
  query: string;
  count: number;
  aggregations?: IContentAggregations;
}
