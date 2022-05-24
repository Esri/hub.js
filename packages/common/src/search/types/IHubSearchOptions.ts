import { UserSession } from "@esri/arcgis-rest-auth";
import { IHubRequestOptions, IModel } from "../..";
import { NamedApis, IApiDefinition } from "./types";

// @private
// TODO Deprecate in favor of Includable
export type Enrichments = "data" | "metadata" | "org" | "service" | "layers";

/**
 * Search Options
 */
export interface IHubSearchOptions {
  aggFields?: string[];
  aggLimit?: number;
  api?: NamedApis | IApiDefinition;
  /**
   * TODO: Deprecate in favor of IHubRequestOptions
   */
  authentication?: UserSession;
  /**
   * While hubSearch requires requestOptions, it is not marked
   * required because that is a breaking change to this
   * interface, which is still required while we implement
   * hubSearch
   */
  requestOptions?: IHubRequestOptions;
  bbox?: string;
  /**
   * Objects or fields to include
   * Initially, this is limited to ItemOrServerEnrichments
   * but it will be extended to allow arbitrary
   */
  include?: string[];
  /**
   * Enrichments
   * Deprecated in favor of includes
   */
  enrichments?: Enrichments[];
  fields?: string;
  num?: number;
  page?: string;
  sortField?: string;
  sortOrder?: "desc" | "asc";
  start?: number;
  // DEPRECATION
  aggregations?: string[];
  site?: IModel;
}
