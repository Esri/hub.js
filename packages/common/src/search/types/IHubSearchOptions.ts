import { UserSession } from "@esri/arcgis-rest-auth";
import { IArcGISContext, IHubRequestOptions, IModel } from "../..";
import { NamedApis, IApiDefinition } from "./types";

// @private
// TODO Deprecate in favor of Includable
export type Enrichments = "data" | "metadata" | "org" | "service" | "layers";

/**
 * Search Options
 */
export interface IHubSearchOptions {
  /**
   * Fields to return aggregations on
   */
  aggFields?: string[];
  /**
   * Maximum number of aggregations to return
   * Portal API only supports a single value
   */
  aggLimit?: number;

  /**
   * Deprecate in favor of context
   */
  api?: NamedApis | IApiDefinition;
  /**
   * TODO: Deprecate in requestOptions
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
   * e.g. `server.layers AS serverLayers`
   */
  include?: string[];
  /**
   * Enrichments
   * Deprecated in favor of `include`
   */
  enrichments?: Enrichments[];
  /**
   * Maximum number of results to return, per-page
   */
  num?: number;
  /**
   * What page of results to return
   */
  page?: string;
  /**
   * What field should the results be sorted on
   */
  sortField?: string;
  /**
   * Sort direction
   */
  sortOrder?: "desc" | "asc";
  /**
   * TODO: Determine if this is used or can be removed
   */
  start?: number;
  // DEPRECATION
  aggregations?: string[];
  site?: IModel;
  fields?: string;
}
