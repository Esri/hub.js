import { IMetricResult } from "../core";
import { DynamicAggregation } from "../core/types/DynamicValues";

/**
 * Given an array of metrics, aggregate them using the specified aggregation
 * Consumer must be aware of the type of the metrics and pass an appropriate aggregation
 * @param metrics
 * @param aggregation
 * @returns
 */
export function aggregateMetrics(
  metrics: IMetricResult[],
  aggregation: DynamicAggregation
): any {
  // Get the values from the metrics, we use any so
  // we can keep the rest of the code simpler
  const values = metrics.map((m) => m.value as any);

  let aggregate = null;

  switch (aggregation) {
    case "sum":
      aggregate = values.reduce((acc, v) => acc + v, 0);
      break;
    case "count":
      aggregate = values.length;
      break;
    case "avg":
      aggregate = values.reduce((acc, v) => acc + v, 0) / values.length;
      break;
    case "min":
      aggregate = values.reduce((acc, v) => Math.min(acc, v), Number.MAX_VALUE);
      break;

    case "max":
      aggregate = values.reduce((acc, v) => Math.max(acc, v), Number.MIN_VALUE);
      break;
    case "countByValue": // count for each value as a hash {value: string, count: number}
      aggregate = values.reduce((acc, v) => {
        if (acc[v]) {
          acc[v] += 1;
        } else {
          acc[v] = 1;
        }
        return acc;
      }, {});
      break;
  }

  return aggregate;
}
