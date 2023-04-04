import { ResolvedMetrics } from "../../metrics/metricsTypes";

/**
 * Adds metrics functions to an entity
 */
export interface IWithMetricsBehavior {
  /**
   * Resolve the metrics for this entity
   */
  resolveMetrics(): Promise<ResolvedMetrics>;
}
