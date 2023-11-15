import { getWithDefault } from "../../../../objects";
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

  // get with default in case we have an undefined metrics array
  const metrics = getWithDefault(entityCopy, "metrics", []);
  const mIndex = metrics.findIndex((m: IMetric) => m.id === metricId);

  // get array in case of undefined displays array
  const displays = getWithDefault(entityCopy, "view.metricDisplays", []);
  const dIndex = displays.findIndex(
    (d: IMetricDisplayConfig) => d.metricId === metricId
  );

  // existing vs new metric
  if (mIndex > -1) {
    metrics[mIndex] = metric;
  } else {
    metrics.push(metric);
  }

  // existing vs new display
  if (dIndex > -1) {
    displays[dIndex] = displayConfig;
  } else {
    displays.push(displayConfig);
  }

  // reset the arrays
  entityCopy.view.metricDisplays = displays;
  entityCopy.metrics = metrics;

  return entityCopy;
}
