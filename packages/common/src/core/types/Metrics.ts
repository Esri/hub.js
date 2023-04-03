import { IConfigurationSchema, IUiSchema } from "../schemas";
import { DynamicValueDefinition, CountByValue } from "./DynamicValues";

export interface IMetric {
  id: string;
  source: DynamicValueDefinition;
  display: IMetricDisplay;
  editor: IMetricEditor;
  required: boolean;
}

export interface IMetricSourceValue {
  id: string;
  value: number | string;
}

export interface IMetricEditor {
  schema?: IConfigurationSchema;
  uiSchema?: IUiSchema;
}

/**
 * Properties used to display a Metric in the UX
 */
export interface IMetricDisplay {
  title: string;
  order: number;
  subtitle?: string;
  unit?: string;
  unitPosition?: "before" | "after" | "below";
  trailingText?: string;
  popoverTitle?: string;
  popoverDescription?: string;
}

/**
 * Metric definition is a dynamic value definition with the display properties
 */
// export type MetricDefinition = DynamicValueDefinition & {
//   display: MetricDisplay;
// };

/**
 * Metric Value is stored on the child entity and is the source value used to resolve the metric
 */
export type MetricValue = number | string | DynamicValueDefinition;

/**
 * A hash of MetricValue objects, keyed by the specified outPath
 */
export type MetricValues = Record<string, MetricValue>;

/**
 * The result of resolving a metric value
 */
export type MetricValueResult = number | string | CountByValue;

/**
 * A MetricValueResult with the display properties
 */
export type MetricValueDisplay = IMetricDisplay & { value: MetricValueResult };

/**
 * The strucure returned once a metric has been resolved
 * Key is the outPath of the metric definition
 */
export interface IResolvedMetric {
  [key: string]: MetricValueDisplay;
}

export type ResolvedMetrics = Record<string, MetricValueDisplay>;
