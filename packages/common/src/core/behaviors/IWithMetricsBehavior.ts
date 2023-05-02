import { IResolvedMetric } from "../types/Metrics";

/**
 * Adds metrics functions to an entity
 */
export interface IWithMetricsBehavior {
  /**
   * Resolve a single metric
   */
  resolveMetric(metricId: string): Promise<IResolvedMetric>;
}
