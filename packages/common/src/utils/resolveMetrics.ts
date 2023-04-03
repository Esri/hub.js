import { IArcGISContext } from "../ArcGISContext";
import {
  IMetric,
  IResolvedMetric,
  ResolvedMetrics,
} from "../core/types/Metrics";
import { cloneObject } from "../util";
import { resolveDynamicValue } from "./internal/resolveDynamicValue";

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
    if (!metrics.hasOwnProperty(metricKey)) continue;
    const metric = metrics[metricKey];
    const resolvedMetric = await resolveMetric(metric, context);
    result = { ...result, ...resolvedMetric };
  }
  return result;
}

/**
 * Resolve a single metric definition
 * @param definition
 * @param context
 * @returns
 */
export async function resolveMetric(
  metric: IMetric,
  context: IArcGISContext
): Promise<IResolvedMetric> {
  const dvSource = cloneObject(metric.source);
  // Delegate to dynamic value subsystem
  const resolvedValue = await resolveDynamicValue(dvSource, context);
  // const resolvedValue = await Promise.resolve({} as Record<string, any>);
  // construct the resolved metric
  const result: IResolvedMetric = {
    [metric.source.outPath]: {
      value: resolvedValue[metric.source.outPath],
      ...metric.display,
    },
  };

  return result;
}
