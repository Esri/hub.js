import { IHubInitiative, IHubProject } from "../core";
import { getProp } from "../objects/get-prop";
import { cloneObject } from "../util";
import { IMetric } from "./metricsTypes";

/**
 * @internal
 * Dereference any $use properties in the metrics. This does not
 * do a deep traversal, but rather just looks at some specific props
 * @param entity
 * @returns
 */
export function preprocessMetrics(
  entity: IHubProject | IHubInitiative
): Record<string, IMetric> {
  // iterate the metrics and dereference any $use properties
  const metrics = cloneObject(entity.metrics || {});
  for (const metricKey in metrics) {
    // Typescript requires this guard, but we can't actually test this
    /* istanbul ignore if */
    if (!metrics.hasOwnProperty(metricKey)) continue;
    let m = metrics[metricKey] as Record<string, any>;
    // if the metric is a ref, then replace it with the referenced value
    if (m.$use) {
      m = getProp(entity, m.$use);
    }
    // now see if the scope is a ref and replace it with the referenced value
    if (m.definition.type === "item-query") {
      if (m.definition.scope.$use) {
        const scope = getProp(entity, m.definition.scope.$use);
        m.definition.scope = cloneObject(scope);
      }
    }
    // inject the source information for the types that need it
    // we do this on the fly because the title could change, and
    // if we have to update one prop, we may as well create the whole hash
    if (["static-value", "service-query"].includes(m.definition.type)) {
      m.definition.source = {
        type: entity.type,
        id: entity.id,
        label: entity.name,
      };
    }
    // assign it back onto the clone
    metrics[metricKey] = m as IMetric;
  }
  return metrics as Record<string, IMetric>;
}
