import { IMetric, IServiceQueryMetricSource, IStaticValueMetricSource, MetricSource } from "../../types";
import { IMetricCardConfig } from "../internal/cards/types";
import { IConfigurationValues } from "../types"

export const metricToEditor = (
  metric: IMetric,
  cardConfig: IMetricCardConfig
): IConfigurationValues => {
  let editor = { ...cardConfig };
  const metricType = (metric.source as MetricSource).type;

  switch (metricType) {
    case 'service-query':
      editor = {
        dynamicMetric: {
          ...(metric.source as IServiceQueryMetricSource),
        },
        ...editor
      }
      break;
    case 'static-value':
      editor = {
        ...editor,
        value: (metric.source as IStaticValueMetricSource).value
      }
      break;
  }


  return editor;
}