import { IQuery } from "../../search/types/IHubCatalog";

/**
 * A set of dynamic values, keyed by the outPath
 */
export type DynamicValues = Record<string, DynamicValue>;

/**
 * A dynamic value can be a string, number, or another definition
 * which will be recursively resolved.
 */
export type DynamicValue = string | number | DynamicValueDefinition;

/**
 * The source for a dynamic value. Used to determine how to resolve the value
 */
export type DynamicValueType =
  | "static-value"
  | "item-query"
  | "service-query"
  | "portal";

/**
 * Properties shared by all DynamicValueDefinitions
 */
interface IBaseValueDefinition {
  type: DynamicValueType;
  /**
   * The property path used to connect the resolved value to the parent object
   */
  outPath: string;
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
  /**
   * Source Information - id, type and label for the source of the value.
   * This allows tracing back to the source of the value, and also allows
   * for a label to be provided for the value
   */
  source: IValueSource;
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
 * Aggregations that can be done on a service
 */
export type ServiceAggregation = "count" | "sum" | "min" | "max" | "avg";

/**
 * Aggregations that can be applied to a set of dynamic values
 */
export type DynamicAggregation = ServiceAggregation | "countByValue";

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
  /**
   * A scope that is used to constring the query. For example
   * this could be the scope of the Projeects collection in
   * the item's catalog. Typically this is stored
   * as an `IReference`, which is dereferenced at runtime.
   * If undefined, the query is executed on it's own
   */
  scope?: IQuery | IReference;
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
  /**
   * Source Information - id, type and label for the source of the value.
   * This allows tracing back to the source of the value, and also allows
   * for a label to be provided for the value
   */
  source: IValueSource;
}

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
 * Interface for a reference to another value in the same object graph.
 * Can be used with `getProp(obj, ref.$use)` to get the value of the referenced property
 */
export interface IReference {
  $use: string;
}

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
 * The output of the resolution of a dynamic value
 */
export type DynamicValueResult = string | number | CountByValue;

/**
 * The output of the resolution of a dynamic value
 */
export interface IDynamicValueOutput {
  /**
   * Aggregated value
   */
  value: DynamicValueResult;
  /**
   * Values and information on the source of the value
   * Used to disaggregate aggregated value or facilitate
   * other displays
   */
  sources: IValueSource[];
}

/**
 * The source of a dynamic value. This allows the aggregated value to be
 * traced back to the source of the value.
 */
export interface IValueSource {
  /**
   * The id of the entity from which the value was computed
   */
  id: string;
  /**
   * Name / title of the entity from which the value was computed
   */
  label: string;
  /**
   * The type of entity from which the value was computed
   */
  type: string;
  /**
   * The value which was computed. This allows for showing the
   * contribution of an individual source to the aggregated value
   */
  value?: DynamicValueResult;
}
