import { IQuery } from "../../search/types/IHubCatalog";
import { FieldType, IField } from "@esri/arcgis-rest-types";
import { IReference } from "./IReference";
import { ServiceAggregation } from "../../core/types/DynamicValues";

/**
 * Defines the information required from a Metric
 */
export interface IMetric {
  /**
   * Identifier for the metric. This must be static over time or linkages
   * between items will break. Can be the camelCase version of the name
   * as long as it's a valid Javascript property name (can't start with numbers).
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
   * Unit of the value. In the future this will be a list of well-known units
   */
  units?: string;
  /**
   * Source definition. This can be an `IReference` to another metric to enable
   * re-use of the same metric source for multiple metrics.
   */
  source: MetricSource | IReference;

  /**
   * Information about the source entity that will be attached to the `IMetricFeature` when it's resolved.
   * This will be added to the `IMetric` as it's processed.
   */
  entityInfo?: IEntityInfo;
}

/**
 * Basic information about the source of the metric, that will be added to the `IMetricFeature` when it's resolved
 */
export interface IEntityInfo {
  /**
   * The id of the entity from which the Metric was computed
   */
  id: string;
  /**
   * Name of the entity from which the value was computed
   */
  name: string;
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
  type: "static-value";
  /**
   * Static value to use
   */
  value: string | number;
}

/**
 * Defines a metric source that is a query to a service.
 */
export interface IServiceQueryMetricSource extends IServiceQuery {
  type: "service-query";
}

/**
 * Defines a metric source that fetches values from a set of items.
 */
export interface IItemQueryMetricSource {
  type: "item-query";
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

export interface IMetricAttributes extends IEntityInfo {
  [key: string]: number | string | null;
}

/**
 * Output of a metric, which merges the source info (id, label, type) with the value
 */
export interface IMetricFeature {
  attributes: IMetricAttributes;
  geometry?: __esri.Geometry;
}

/**
 * Result of resolving a metric
 */
export interface IResolvedMetric {
  features: IMetricFeature[];
  generatedAt: number;
}

/**
 * Expression by which a metric can be filtered before aggregation, i.e. a clause of a where statement
 */
export interface IExpression {
  /**
   * Field that the expression filters on
   */
  field?: IField;
  /**
   * The values that the where clause will be using on the right-hand side of the statement: this can be an array of strings, numbers, or dates.
   * These values will be used in conjunction with the field to construct a where clause.
   */
  values?: Array<string | number | Date>;
  /**
   * A special identifier given to the expression when it is created
   */
  key?: string;
  /**
   * Relation between the values in an expression
   */
  relationship?: ExpressionRelationships;
}

/**
 * Possible relationships for an expression
 * BETWEEN -- used to show between two values, i.e. 7 < x < 10
 * IS_EXACTLY -- for exact matching, i.e. two same strings
 */
export enum ExpressionRelationships {
  BETWEEN = "between",
  IS_EXACTLY = "isExactly",

  // deprecated and not currently allowed for new use, only used for migrating older stat cards
  LIKE = "like",
}

/**
 * Configuration for how to show a metric in the ui. These are just values that are important to how to
 * display the metric; values that are configured in the editor should be added to IMetricEditorValues instead.
 */
export interface IMetricDisplayConfig extends IMetricEditorValues {
  metricId: string;
  displayType: string;
  visibility?: MetricVisibility;
}

/**
 * Types of states of visibility a metric can be in
 * featured, visible, or hidden
 */
export enum MetricVisibility {
  visible = "visible",
  hidden = "hidden",
  featured = "featured",
}

/**
 * Editor values expected when editing a metric. These are options that are set in the metric editor that
 * help build the IMetricDisplayConfig.
 */
export interface IMetricEditorValues {
  /** the main value of the metric  */
  value?: string | number;
  /** all values related to constructing a service-query metric */
  dynamicMetric?: IDynamicMetricValues;

  // TODO: enumerate all editor values here
  [key: string]: any;
}

/**
 * Editor values associated with editing a dynamic metric
 */
export interface IDynamicMetricValues {
  /** id of the item being queried */
  itemId?: string;
  /** id of the layer of the item being queried */
  layerId?: number;
  /** field of the layer of the item being queried to run the aggregation on */
  field?: string;
  /** the method of service aggregation -- count, min, max, etc. */
  statistic?: string;
  /** the feature service url of the item being queried */
  serviceUrl?: string;
  /** the esri-dictated field type of the field being queried */
  fieldType?: FieldType;
  /** a clause to filter the query by -- ex: field BETWEEN 0 AND 2 */
  where?: string;
  /** the ui navigational link to the item source */
  sourceLink?: string;
  /** the text displayed in the ui for the sourceLink */
  sourceTitle?: string;
  /** whether attribute filtering should be enabled */
  allowExpressionSet?: boolean;
  /** a list of expressions with which to construct a where clause */
  expressionSet?: IExpression[];
  /** the old where clause, utilized during the migration of the old summary stat card */
  legacyWhere?: string;

  [key: string]: any;
}

/** Maxmium number of metrics allowed on any given entity. */
export const MAX_ENTITY_METRICS_ALLOWED = 24;
