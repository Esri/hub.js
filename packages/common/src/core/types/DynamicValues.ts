import { IQuery } from "../../search/types/IHubCatalog";
import { IConfigurationSchema } from "../schemas";

/**
 * The source for a dynamic value. Used to determine how to resolve the value
 */
export type DynamicValueType =
  | "static-value"
  | "item-query"
  | "service-query"
  | "portal";

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

/**
 * Aggregations that can be done on a service
 */
export type ServiceAggregation = "count" | "sum" | "min" | "max" | "avg";

/**
 * Aggregations that can be applied to a set of dynamic values
 */
export type DynamicAggregation = ServiceAggregation | "countByValue";

/**
 * Properties shared by all DynamicValueDefinitions
 */
interface IBaseValueDefinition {
  type: DynamicValueType;
  /**
   * The property path used to connect the resolved value to the parent object
   */
  outPath: string;
  /**
   * JSON schema used to validate the value. If not provided, the value will not be validated
   * NOTE: This may be swapped for a smaller set of props that would be used to generate the schema
   */
  schema?: Partial<IConfigurationSchema>;
}

/**
 * Definition for a static value that is not resolved via a query.
 * Enables workflows where the dynamic value source is not yet configured, or the value is known ahead of time
 */
export interface IStaticValueDefinition extends IBaseValueDefinition {
  type: "static-value";
  /**
   * Enables a static value to be provided vs forcing a dynamic value
   */
  value: string | number;
}

/**
 * Definition for a dynamic value that is resolved from the portal/self
 */
export interface IDynamicPortalSelfDefinition extends IBaseValueDefinition {
  type: "portal";
  /**
   * The path to the property on the portal/self response to return
   */
  sourcePath: string;
}

/**
 * Interface for a reference to another value in the same object graph.
 * Can be used with `getProp(obj, ref.$use)` to get the value of the referenced property
 */
export interface IReference {
  $use: string;
}

/**
 * Definition for a dynamic value that is resolved from an item query to the portal
 */
export interface IDynamicItemQueryDefinition extends IBaseValueDefinition {
  type: "item-query";
  /**
   * The path to the property on the item to return
   */
  sourcePath: string;
  /**
   * Portal Query to be exectute to return the set of items
   */
  query?: IQuery | IReference;
  /**
   * The type of aggregation to apply to the set of results
   */
  aggregation: DynamicAggregation;
  scope?: IQuery | IReference;
  /**
   * Indicates if the raw values should be returned
   */
  includeRawValues?: boolean;
}

/**
 * Definition for a dynamic value that is resolved from a feature service query
 */
export interface IDynamicServiceQueryDefinition extends IBaseValueDefinition {
  type: "service-query";
  /**
   * Options used for the service query
   */
  options: IServiceQueryOptions;
  /**
   * The type of aggregation to apply to the set of results
   */
  aggregation: DynamicAggregation;
}

// FUTURE: Add a telemetry definition
// export interface IDynamicTelemetryQueryDefinition
//   extends IBaseValueDefinition {
//   type: "telemetry-query";
//   /**
//    * Other props TBD
//    */
//   tbd: string;
//   /**
//    * The type of aggregation to apply to the set of results
//    */
//   aggregation: DynamicAggregation;
// }

/**
 * Union of all the dynamic value definitions
 */
export type DynamicValueDefinition =
  | IStaticValueDefinition
  | IDynamicPortalSelfDefinition
  | IDynamicItemQueryDefinition
  | IDynamicServiceQueryDefinition;

/**
 * Type to hold a count-by-value result
 * ```js
 * { "value1": 2, "value2": 1}
 * ```
 */
export type CountByValue = Record<string, number>;

/**
 * A dynamic value can be a string, number, or another definition
 * which will be recursively resolved.
 */
export type DynamicValue = string | number | DynamicValueDefinition;

/**
 * The output of the resolution of a dynamic value
 */
export type DynamicValueResult = string | number | CountByValue;

/**
 * A set of dynamic values, keyed by the outPath
 */
export type DynamicValues = Record<string, DynamicValue>;
