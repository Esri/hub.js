import { IHubProject } from "../../../types/IHubProject";
import { IMetric, IMetricDisplayConfig } from "../../../types/Metrics";

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
