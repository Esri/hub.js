import { Visibility } from "@esri/hub-common";
import { IRequestOptions } from "@esri/arcgis-rest-request";
import { IPagingParams } from "@esri/arcgis-rest-portal";

export type Access = "public" | "org" | "shared" | "private";

/**
 * Common Interface for Queries Across Content/Group Searches
 * For further information, see Search Reference Page (https://developers.arcgis.com/rest/users-groups-and-items/search-reference.htm)
 * Each is also mapped and searchable in Hub Index
 */
export interface ISearchQueryParams {
  id?: string | string[];
  owner?: string | string[];
  created?: [number, number] | Array<[number, number]>;
  modified?: [number, number] | Array<[number, number]>;
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

// Other properties to consider
// * snippet -> Searchable in Content but Not Mapped In Index

export interface ISearchSiteContentParams {
  siteId: string;
}
