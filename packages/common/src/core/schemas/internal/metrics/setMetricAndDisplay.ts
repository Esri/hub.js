import { IHubProject } from "../../../types/IHubProject";
import { IMetric, IMetricDisplayConfig } from "../../../types/Metrics";

/**
 * Sets a given metric and metricDisplayConfig on an entity's metric and view.metricDisplays props.
 *
 * @param entity - should have metric and metricDisplays implemented
 * @param metric - IMetric
 * @param displayConfig - IMetricDisplayConfig configuration to display the metric in the ui
 */
export function setMetricAndDisplay(
  entity: IHubProject,
  metric: IMetric,
  displayConfig: IMetricDisplayConfig
): void {
  const metricId = metric.id;
  const mIndex = entity.metrics.findIndex((m) => m.id === metricId);
  const dIndex = entity.view.metricDisplays.findIndex(
    (d) => d.metricId === metricId
  );

  // existing metric and display
  if (mIndex > -1 && dIndex > -1) {
    entity.metrics[mIndex] = metric;
    entity.view.metricDisplays[dIndex] = displayConfig;
  }
  // new metric and display
  else {
    entity.metrics.push(metric);
    entity.view.metricDisplays.push(displayConfig);
  }
}
