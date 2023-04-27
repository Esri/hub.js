import { IHubRequestOptions } from "../../types";
import { EntityType } from "./IHubCatalog";

import { NamedApis, IApiDefinition } from "./types";

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
   * TODO: Deprecate in favor of `requestOptions` and `siteUrl`
   * Specify API to call. Defaults to ArcGIS Online Portal API
   */
  api?: NamedApis | IApiDefinition;

  /**
   * Site whose API should be targeted. Ignored in an enterprise context.
   * e.g., https://my-site.hub.arcgis.com
   */
  site?: string;

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
   * Maximum number of results to return, per-page
   */
  num?: number;
  /**
   * LEGACY. Use `start` and `num` instead
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
   * The result number of the first entry in the result set response. The start parameter, along with the num parameter, can be used to paginate the search results.
   */
  start?: number;

  /**
   * Enables experimental functionality.
   */
  useBeta?: boolean;
}
