import { ISearchOptions } from "@esri/arcgis-rest-portal";
import { IConfigurationSchema } from "../schemas";

/**
 * The source for a dyanmic value. Used to determine how to resolve the value
 */
export type DynamicValueSource = "item-query" | "service-query" | "portal";

/**
 * Subset of the ISearchOptions interface, used for item queries
 */
export type ItemSearchOptions = Partial<Pick<ISearchOptions, "q" | "filter">>;

/**
 * Options used to defined a feature service query
 */
export interface IServiceSearchOptions {
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
 * Properties shared by all DyanmicValueDefinitions
 */
interface IBaseDynamicValueDefinition {
  outPath: string;
  required: boolean;
  schema?: Partial<IConfigurationSchema>;
}

/**
 * Definition for a dynamic value that is resolved from the portal/self
 */
export interface IDynamicPortalQueryDefinition
  extends IBaseDynamicValueDefinition {
  source: "portal";
  sourcePath: string;
}

/**
 * Definition for a dynamic value that is resolved from an item query to the portal
 */
export interface IDynamicItemQueryDefinition
  extends IBaseDynamicValueDefinition {
  source: "item-query";
  sourcePath: string;
  options: ItemSearchOptions;
  aggregation: DynamicAggregation;
}

/**
 * Definition for a dynamic value that is resolved from a feature service query
 */
export interface IDynamicServiceQueryDefinition
  extends IBaseDynamicValueDefinition {
  source: "service-query";
  options: IServiceSearchOptions;
  aggregation: DynamicAggregation;
}

/**
 * Union of all the dynamic value definitions
 */
export type DynamicValueDefinition =
  | IDynamicPortalQueryDefinition
  | IDynamicItemQueryDefinition
  | IDynamicServiceQueryDefinition;

/**
 * A dynamic value can be a string, number, or another definition
 * which will be recursively resolved.
 */
export type DynamicValue = string | number | DynamicValueDefinition;

/**
 * A set of dynamic values, keyed by the outPath
 */
export type DynamicValues = Record<string, DynamicValue>;
