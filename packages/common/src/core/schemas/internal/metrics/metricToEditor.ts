import {
  IMetric,
  IMetricDisplayConfig,
  IMetricEditorValues,
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
): IMetricEditorValues {
  const {
    allowExpressionSet,
    expressionSet,
    fieldType,
    itemId,
    statistic,
    ...config
  } = displayConfig;
  let editor = {
    ...config,
  };

  if (metric && metric.source) {
    const metricType = (metric.source as MetricSource).type || "";

    switch (metricType) {
      case "service-query":
        const { where, ...source } = metric.source as IServiceQueryMetricSource;
        editor = {
          type: "dynamic",
          dynamicMetric: {
            ...source,
            where: decodeURIComponent(where),
            itemId,
            expressionSet,
            allowExpressionSet,
            fieldType,
          },
          ...editor,
        };
        break;

      case "static-value":
        editor = {
          type: "static",
          value: (metric.source as IStaticValueMetricSource).value,
          ...editor,
        };
        break;
    }
  }

  return editor;
}
