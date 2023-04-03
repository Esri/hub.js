import { IArcGISContext } from "../ArcGISContext";
import { IMetric, ResolvedMetrics } from "./metricsTypes";
import { resolveMetric } from "./resolveMetric";

/**
 * Resolve a set of metric definitions.
 * If the metrics have references, they need to be dereferenced
 * before calling this function. Typically that is done by the caller
 * @param metrics
 * @param context
 * @returns
 */
export async function resolveMetrics(
  metrics: Record<string, IMetric>,
  context: IArcGISContext
): Promise<ResolvedMetrics> {
  let result = {} as ResolvedMetrics;
  // TODO: parallelize this via Promise.all
  for (const metricKey in metrics) {
    // Typescript demands this guard, but it is not clear how to actually test it
    // so we are ignoring it for now
    /* istanbul ignore if */
    if (!metrics.hasOwnProperty(metricKey)) continue;
    const metric = metrics[metricKey];
    const resolvedMetric = await resolveMetric(metric, context);
    result = { ...result, ...resolvedMetric };
  }
  return result;
}
