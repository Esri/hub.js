import { IHubInitiative } from "../core/types/IHubInitiative";
import { IMetric } from "../metrics/metricsTypes";
import { getProp } from "../objects/get-prop";
import { cloneObject } from "../util";

/**
 * @internal
 * Dereference any $use properties in the metrics. This does not
 * do a deep traversal, but rather just looks at some specific props
 * @param initiative
 * @returns
 */
export function dereferenceInitiativeMetrics(
  initiative: IHubInitiative
): Record<string, IMetric> {
  // iterate the metrics and dereference any $use properties
  const metrics = cloneObject(initiative.metrics || {});
  for (const metricKey in metrics) {
    // Typescript requires this guard, but we can't actually test this
    /* istanbul ignore if */
    if (!metrics.hasOwnProperty(metricKey)) continue;
    let m = metrics[metricKey] as Record<string, any>;
    // if the metric is a ref, then replace it with the referenced value
    if (m.$use) {
      m = getProp(initiative, m.$use);
    }
    // now see if the source is a ref and replace it with the referenced value
    if (m.source.type === "item-query") {
      if (m.source.scope.$use) {
        const source = getProp(initiative, m.source.scope.$use);
        m.source.scope = cloneObject(source);
      }
    }
    // assign it back onto the clone
    metrics[metricKey] = m as IMetric;
  }
  return metrics as Record<string, IMetric>;
}
