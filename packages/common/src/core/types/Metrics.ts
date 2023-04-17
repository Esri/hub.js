import { IQuery } from "../../search/types/IHubCatalog";
import { ServiceAggregation } from "./DynamicValues";
import { IReference } from "./IReference";

/**
 * Defines the information required from a Metric
 */
export interface IMetric {
  /**
   * Identifier for the metric. Typically generated via `createId("m")`
   */
  id: string;
  /**
   * Name of the metric. Will be shown in UI's
   */
  name?: string;
  /**
   * Description of the metric. Will be shown in UI when user is configuring
   * the value or source of the value
   */
  description?: string;
  /**
   * Unit of the value.
   */
  units?: string; // TODO: this should be a list of units
  /**
   * Source definition
   */
  source: MetricSource | IReference;

  /**
   * Information that will be attached to the metric when it's resolved
   */
  sourceInfo?: IMetricSourceInfo;
}

/**
 * Defines the information that will be attached to the metric when it's resolved
 */
export interface IMetricSourceInfo {
  metricId?: string;
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
}

/**
 * Defines a query to a service
 */
export interface IServiceQuery {
  /**
   * Feature Service Url
   */
  serviceUrl: string;
  /**
   * Layer Id
   */
  layerId: number;
  /**
   * Field to run stats on
   */
  field: string;
  /**
   * Statistic to run on the field
   */
  statistic: ServiceAggregation;
  /**
   * Optional where clause to filter the query
   */
  where?: string;
  /**
   * NOT IMPLEMENTED: Optional set of fields to group by.
   */
  groupBy?: {
    fields: string[];
    having: string;
  };
  /**
   * NOT IMPLEMENTED: Optional set of fields to order by.
   */
  orderBy?: string[];
  /**
   * NOT IMPLEMENTED: Time instant to query
   */
  time?: number;
  /**
   * NOT IMPLEMENTED: Time range to query
   */
  timeRange?: [null | number, null | number];
}

/**
 * Union type of all the valid metric sources.
 * To add additional sources, add them to this union type
 */
export type MetricSource =
  | IStaticValueMetricSource
  | IServiceQueryMetricSource
  | IItemQueryMetricSource;

/**
 * Defines a metric source that is a static value
 */
export interface IStaticValueMetricSource {
  metricType: "static-value";
  /**
   * Static value to use
   */
  value: string | number;
}

/**
 * Defines a metric source that is a query to a service.
 */
export interface IServiceQueryMetricSource extends IServiceQuery {
  metricType: "service-query";
}

/**
 * Defines a metric source that fetches values from a set of items.
 */
export interface IItemQueryMetricSource {
  metricType: "item-query";
  /**
   * Property path to get the value from the item
   * e.g. `properties.numComments` or `properties.metrics[findBy(id,'funding_00c')].source`
   */
  propertyPath: string;
  /**
   * Keywords used in the query to search for items
   */
  keywords: string[];
  /**
   * Item types to limit the search
   */
  itemTypes?: string[];
  /**
   * Key of the collection to further limit the search
   * This is resolved into an `IQuery` in the pre-processing step.
   * If not defined, only the keyword and item types are used.
   */
  collectionKey?: string;
  /**
   * Scope query. This will be pulled from the collection if `collectionKey` is defined.
   */
  scope?: IQuery;
}

export interface IMetricAttributes extends IMetricSourceInfo {
  [key: string]: number | string | null;
}

/**
 * Output of a metric, which merges the source info (id, label, type) with the value
 */
export interface IMetricFeature {
  attributes: IMetricAttributes;
  geometry?: __esri.Geometry;
}
