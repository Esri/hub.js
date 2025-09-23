import { ServiceAggregation } from "./ServiceAggregation";

/**
 * Options used to defined a feature service query
 */
export interface IServiceQueryOptions {
  /**
   * The url of the feature service, including the layer
   */
  url: string;
  /**
   * Field on which to run an aggregation
   */
  field: string;
  /**
   * The type of server-side aggregation to run
   */
  statisticType: ServiceAggregation;
  /**
   * Where clause to apply to the query. Defaults to "1=1" if not provided
   */
  where?: string;
}
