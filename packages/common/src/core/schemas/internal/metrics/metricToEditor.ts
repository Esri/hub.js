import { IConfigurationValues } from "../../types";
import {
  IMetric,
  IMetricDisplayConfig,
  IServiceQueryMetricSource,
  IStaticValueMetricSource,
  MetricSource,
} from "../../../types/Metrics";

/**
 * Util to convert a metric into editor values consumable by the configuration editor
 * @param metric - IMetric metric
 * @param displayConfig - display configuration for the metric
 * @returns
 */
export function metricToEditor(
  metric: IMetric,
  displayConfig: IMetricDisplayConfig
): IConfigurationValues {
  let editor = { ...displayConfig };
  if (metric && metric.source) {
    const metricType = (metric.source as MetricSource).type || "";

    switch (metricType) {
      case "service-query":
        editor = {
          dynamicMetric: {
            ...(metric.source as IServiceQueryMetricSource),
          },
          ...editor,
        };
        break;

      case "static-value":
        editor = {
          ...editor,
          value: (metric.source as IStaticValueMetricSource).value,
        };
        break;
    }
  }

  return editor;
}
