import { IEntityInfo, IMetric, MetricSource } from "../../types";
import { IMetricCardConfig } from "../internal/cards/types";
import { IConfigurationValues } from "../types";

export const editorToMetric = (
  values: IConfigurationValues,
  metricId: string,
  opts?: { metricName?: string, entityInfo?: IEntityInfo }
): { metric: IMetric, cardConfig: IMetricCardConfig } => {
  const { value, dynamicMetric, ...config } = values;
  const { layerId, field, statistic, serviceUrl, fieldType } = dynamicMetric || {};
  const { entityInfo, metricName } = opts || {};

  // create source
  const source: MetricSource = values?.type === 'dynamic'
    ? {
      type: 'service-query',
      serviceUrl,
      layerId: layerId,
      field: field,
      statistic: statistic,
    }
    : {
      type: 'static-value',
      value: value,
    };

  // create metric
  const metric = {
    source,
    name: metricName || metricId,
    entityInfo: entityInfo || { id: undefined, name: undefined, type: undefined }, // ensure entity info has id, name, type
    id: metricId,
  };

  delete config.itemId;

  // create card config
  const cardConfig = {
    ...config,
    displayType: config.displayType || 'stat-card',
    metricId,
    fieldType,
    statistic
  };

  return { metric, cardConfig };
}