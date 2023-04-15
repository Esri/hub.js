import { IMetricResult } from "../types/Metrics";

/**
 * Adds metrics functions to an entity
 */
export interface IWithMetricsBehavior {
  /**
   * Resolve the metrics for this entity
   */
  resolveMetrics(): Promise<IMetricResult[]>;
  /**
   * Resolve a single metric
   */
  resolveMetric(metricId: string): Promise<IMetricResult[]>;
}
