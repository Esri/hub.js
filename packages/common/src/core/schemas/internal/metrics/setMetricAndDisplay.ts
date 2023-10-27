import { cloneObject } from "../../../../util";
import { IHubProject } from "../../../types/IHubProject";
import { IMetric, IMetricDisplayConfig } from "../../../types/Metrics";

/**
 * Sets a given metric and metricDisplayConfig on an entity's metric and view.metricDisplays props.
 *
 * @param entity - should have metric and metricDisplays implemented
 * @param metric - IMetric
 * @param displayConfig - IMetricDisplayConfig configuration to display the metric in the ui
 *
 * Right now, this just accepts a HubProject; in the future as more entities support metrics,
 * other entities can be allowed.
 */
export function setMetricAndDisplay(
  entity: IHubProject,
  metric: IMetric,
  displayConfig: IMetricDisplayConfig
): IHubProject {
  const entityCopy = cloneObject(entity);
  const metricId = metric.id;
  const mIndex = entityCopy.metrics.findIndex((m) => m.id === metricId);
  const dIndex = entityCopy.view.metricDisplays.findIndex(
    (d) => d.metricId === metricId
  );

  // existing metric and display
  if (mIndex > -1 && dIndex > -1) {
    entityCopy.metrics[mIndex] = metric;
    entityCopy.view.metricDisplays[dIndex] = displayConfig;
  }
  // new metric and display
  else {
    entityCopy.metrics.push(metric);
    entityCopy.view.metricDisplays.push(displayConfig);
  }

  return entityCopy;
}
