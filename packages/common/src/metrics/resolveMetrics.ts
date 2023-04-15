import { IArcGISContext } from "../ArcGISContext";
import { IMetric, IMetricResult } from "../core/types/Metrics";
import { resolveMetric } from "./resolveMetric";

/**
 * Resolve an array of metrics into an array of `IMetricResult` objects.
 * All the metrics are merged into a single array. Consumers need to
 * extract the results for the metric they are interested in.
 * @param metrics
 * @param context
 * @returns
 */
export async function resolveMetrics(
  metrics: IMetric[],
  context: IArcGISContext
): Promise<IMetricResult[]> {
  const results = await Promise.all(
    metrics.map(async (metric) => {
      return resolveMetric(metric, context);
    })
  );

  // merge the results into a single array
  return results.reduce((acc, val) => acc.concat(val), []);
}
