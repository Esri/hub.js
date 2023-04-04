import { IReference } from "../types";
import { IMetric } from "../../metrics/metricsTypes";

/**
 * Adds metrics properties to an entity
 */
export interface IWithMetrics {
  /**
   * Metric definitions
   */
  metrics?: Record<string, IMetric | IReference>;
}
