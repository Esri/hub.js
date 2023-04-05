import { IArcGISContext } from "../ArcGISContext";
import { IMetric, IResolvedMetric } from "./metricsTypes";
import { cloneObject } from "../util";
import { resolveDynamicValue } from "../utils/internal/resolveDynamicValue";

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
  const dvSource = cloneObject(metric.definition);
  // Delegate to dynamic value subsystem
  const resolvedValue = await resolveDynamicValue(dvSource, context);

  // construct the resolved metric
  const result: IResolvedMetric = {
    [metric.definition.outPath]: {
      ...resolvedValue[metric.definition.outPath],
      ...metric.display,
    },
  };

  return result;
}
