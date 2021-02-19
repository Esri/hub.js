import { UserSession } from "@esri/arcgis-rest-auth";
import { IPagingParams } from "@esri/arcgis-rest-portal";
import { IDateRange, SortDirection } from "./common";
import { ISearchRequest } from "./request";

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
  session?: UserSession;
  portal?: string;
  sortField?: string;
  sortOrder?: SortDirection;
  page?: string | IPagingParams;
  aggregations?: string;
  bbox?: string;
  fields?: string;
}

export interface IContentSearchRequest
  extends ISearchRequest<IContentSearchFilter, IContentSearchOptions> {}
