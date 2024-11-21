import {
  IMetric,
  IMetricDisplayConfig,
  IMetricEditorValues,
  IServiceQueryMetricSource,
  IStaticValueMetricSource,
  MetricSource,
} from "../core/types/Metrics";

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
        editor = {
          type: "dynamic",
          dynamicMetric: {
            ...(metric.source as IServiceQueryMetricSource),
            itemId,
            expressionSet,
            allowExpressionSet,
            fieldType,
            sourceLink: displayConfig.sourceLink,
            sourceTitle: displayConfig.sourceTitle,
          },
          ...editor,
          sourceLink: undefined,
          sourceTitle: undefined,
        };
        break;

      case "static-value":
        editor = {
          type: "static",
          value: (metric.source as IStaticValueMetricSource).value,
          valueType: (metric.source as IStaticValueMetricSource).valueType,
          ...editor,
        };
        break;
    }
  }

  return editor;
}
