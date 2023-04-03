import { IConfigurationSchema, IUiSchema } from "../core/schemas";
import {
  DynamicValueDefinition,
  CountByValue,
} from "../core/types/DynamicValues";

/**
 * Definition of a Metric
 * includes the source, display and editor configurations
 */
export interface IMetric {
  id: string;
  source: DynamicValueDefinition;
  display: IMetricDisplay;
  editor: IMetricEditor;
  required: boolean;
}

// export interface IMetricSourceValue {
//   id: string;
//   value: number | string;
// }

/**
 * Defines the properties used to edit a Metric in the UX
 */
export interface IMetricEditor {
  type: "number" | "text" | "select" | "checkbox";
  label: string;
  description?: string;
}

/**
 * Properties used to display a Metric in the UX
 */
export interface IMetricDisplay {
  title: string;
  order: number;
  type?: "stat-card"; // as we add more display types, add them here
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
