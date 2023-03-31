import { DynamicAggregation } from "../../core/types/DynamicValues";

/**
 * @internal
 * Aggregate a set of values based on the aggregation type
 * @param values
 * @param aggregation
 * @returns
 */
export function aggregateValues(
  values: any[],
  aggregation: DynamicAggregation
): any {
  switch (aggregation) {
    case "sum":
      return values.reduce((acc, v) => acc + v, 0);
    case "count":
      return values.length;
    case "avg":
      return values.reduce((acc, v) => acc + v, 0) / values.length;
    case "min":
      return values.reduce((acc, v) => Math.min(acc, v), Number.MAX_VALUE);
    case "max":
      return values.reduce((acc, v) => Math.max(acc, v), Number.MIN_VALUE);
    case "countByValue": // count for each value as a hash {value: string, count: number}
      return values.reduce((acc, v) => {
        if (acc[v]) {
          acc[v] += 1;
        } else {
          acc[v] = 1;
        }
        return acc;
      }, {});
    default:
      // console.error(`Unknown aggregation: ${aggregation}`);
      return null;
  }
}
