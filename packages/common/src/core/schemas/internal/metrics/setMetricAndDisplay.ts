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
  const mIndex = entityCopy.metrics.findIndex((m) => m.id === metricId);

  // get array in case of undefined
  const displays = getWithDefault(entityCopy, "view.metricDisplays", []);
  const dIndex = displays.findIndex(
    (d: IMetricDisplayConfig) => d.metricId === metricId
  );

  // existing vs new metric
  if (mIndex > -1) {
    entityCopy.metrics[mIndex] = metric;
  } else {
    entityCopy.metrics.push(metric);
  }

  // existing vs new display
  if (dIndex > -1) {
    displays[dIndex] = displayConfig;
  } else {
    displays.push(displayConfig);
  }

  // reset the displays array
  entityCopy.view.metricDisplays = displays;

  return entityCopy;
}
