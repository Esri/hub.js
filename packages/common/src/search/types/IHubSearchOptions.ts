import type { ArcGISIdentityManager } from "@esri/arcgis-rest-request";
import { IHubRequestOptions } from "../../hub-types";
import { EntityType } from "./IHubCatalog";

import { HTTPMethods } from "@esri/arcgis-rest-request";
import { ApiTarget } from "./types";

// @private
// TODO Deprecate in favor of Includable
export type Enrichments = "data" | "metadata" | "org" | "service" | "layers";

/**
 * Paging Options
 * Separated out from IHubSearchOptions to allow for reuse
 */
export interface IPagingOptions {
  /**
   * Maximum number of results to return, per-page
   */
  num?: number;

  /**
   * The result number of the first entry in the result set response. The start parameter, along with the num parameter, can be used to paginate the search results.
   */
  start?: number;
}

/**
 * Sorting Options
 * Separated out from IHubSearchOptions to allow for reuse
 */
export interface ISortOptions {
  /**
   * What field should the results be sorted on
   */
  sortField?: string;
  /**
   * Sort direction
   */
  sortOrder?: "desc" | "asc";
}

/**
 * Search Options
 */
export interface IHubSearchOptions extends IPagingOptions, ISortOptions {
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
   * Specify API to call. Defaults to Portal API defined in requestOptions.
   */
  api?: ApiTarget;

  /**
   * DEPRECATE in favor of requestOptions
   */
  authentication?: ArcGISIdentityManager;
  /**
   * While hubSearch requires requestOptions, it is not marked
   * required because that is a breaking change to this
   * interface, which is still required while we implement
   * hubSearch
   */
  requestOptions?: IHubRequestOptions;
  /**
   * Bounding box for the search (NOT IMPLEMENTED)
   */
  bbox?: string;
  /**
   * Objects or fields to include e.g. `server.layers AS serverLayers`
   */
  include?: string[];

  /**
   * Specify what entity to search for; For use with hubSearch
   */
  targetEntity?: EntityType;
  /**
   * LEGACY. Use `start` and `num` instead
   */
  page?: string;
  /**
   * Allow override of the default http method. Allows for
   * POST requests to be made if the query is very large
   * NOTE: The OGC API will ignore this property
   */
  httpMethod?: HTTPMethods;
}
