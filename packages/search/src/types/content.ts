import { UserSession } from '@esri/arcgis-rest-auth';
import { IPagingParams } from '@esri/arcgis-rest-portal';
import { IDateRange, SortDirection } from './common';
import { ISearchRequest } from './request';

export enum IBooleanOperator {
  AND = "AND",
  OR = "OR",
  NOT = "NOT"
}

export type IFieldFilter<T> = {
  value: T,
  bool?: IBooleanOperator
}

export type IContentFieldFilter = IFieldFilter<string[]>;

export type IContentSearchFilter = {
  terms?: string | string[] | IContentFieldFilter;
  id?: string | string[] | IContentFieldFilter;
  owner?: string | string[] | IContentFieldFilter;
  created?: IDateRange<number>;
  modified?: IDateRange<number>;
  title?: string | string[] | IContentFieldFilter;
  typekeywords?: string | string[] | IContentFieldFilter;
  description?: string | string[] | IContentFieldFilter;
  tags?: string | string[] | IContentFieldFilter;
  orgid?: string| string[] | IContentFieldFilter;
  type?: string | string[] | IContentFieldFilter;
  access?: string | string[] | IContentFieldFilter;
  accessinformation?: string | string[] | IContentFieldFilter;
  group?: string | string[] | IContentFieldFilter;
  culture?: string | string[] | IFieldFilter<string[]>;
  categories?: string | string[] | IContentFieldFilter;
  [key: string]: string | string[] | IDateRange<number> | IContentFieldFilter;
}

export type IContentSearchOptions = {
  session?: UserSession;
  portal?: string;
  sortField?: string;
  sortOrder?: SortDirection;
  page?: string | IPagingParams;
  aggregations?: string;
  bbox?: string;
}

export type IContentSearchRequest = ISearchRequest<IContentSearchFilter, IContentSearchOptions>