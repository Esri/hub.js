import { IMetric } from "../types/Metrics";

/**
 * Adds metrics properties to an entity
 */
export interface IWithMetrics {
  /**
   * Metrics associated with this entity
   */
  metrics?: IMetric[];
}
