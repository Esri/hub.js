import { Visibility, IHubContent } from "@esri/hub-common";
import { IRequestOptions } from "@esri/arcgis-rest-request";
import {
  ISearchResult,
  IPagingParams,
  SearchQueryBuilder
} from "@esri/arcgis-rest-portal";

export type Access = "public" | "org" | "shared" | "private";

export type SearchType = "content" | "group" | "user";

/**
 * Common Interface for Search Across Users, Groups, and Content
 * For users, only search strings are currently supported. Groups and Content support search fields
 * For further information, see Search Reference Page (https://developers.arcgis.com/rest/users-groups-and-items/search-reference.htm)
 */
export interface IBaseQueryParams {
  q?: string | SearchQueryBuilder;
}

/**
 * Common Interface for Queries Across Content/Group Searches
 * For further information, see Search Reference Page (https://developers.arcgis.com/rest/users-groups-and-items/search-reference.htm)
 * Each is also mapped and searchable in Hub Index
 */
export interface ISearchQueryParams extends IBaseQueryParams {
  id?: string | string[];
  owner?: string | string[];
  created?: Array<[number, number]>;
  modified?: Array<[number, number]>;
  title?: string | string[];
  typekeywords?: string | string[];
  description?: string | string[];
  tags?: string | string[];
  orgId?: string | string[];
}

/**
 * Interface For Content Search Queries across Portal API and Hub Index
 * For further information, see Search Reference Page under Items (https://developers.arcgis.com/rest/users-groups-and-items/search-reference.htm)
 * Each is also mapped and searchable in Hub Index
 */
export interface IContentSearchQueryParams extends ISearchQueryParams {
  type?: string | string[];
  accessInformation?: string | string[];
  access?: Access | Access[];
  group?: string | string[];
  culture?: string | string[];
  categories?: string | string[];
  eventLayerId?: string;
  [key: string]: any;
}

/**
 * Interface For Group Search Queries to Portal API
 * For further information, see Search Reference Page under Groups (https://developers.arcgis.com/rest/users-groups-and-items/search-reference.htm)
 * Each is also mapped and searchable in Hub Index
 */
export interface IGroupSearchQueryParams extends ISearchQueryParams {
  snippet?: string | string[];
  phone?: string | string[];
  access?: Visibility | Visibility[];
  isinvitationonly?: boolean;
}

export interface IBaseSearchParams extends IRequestOptions, IPagingParams {
  queryParams: IBaseQueryParams;
  sortField?: string;
  sortOrder?: string;
  aggregations?: string | string[];
}

export interface IContentSearchParams extends IBaseSearchParams {
  queryParams: IContentSearchQueryParams;
}

export interface IGroupSearchParams extends IBaseSearchParams {
  queryParams: IGroupSearchQueryParams;
}

export interface IUnifiedSearchResults<T> {
  total: number;
  num: number;
  results: T[];
  query?: string;
  next?: string;
  aggregations?: {
    counts: Array<{
      fieldName: string;
      fieldValues: Array<{
        value: any;
        count: number;
      }>;
    }>;
  };
}

// Other properties to consider
// * snippet -> Searchable in Content but Not Mapped In Index
