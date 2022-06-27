/**
 * Structure for Search Aggregations in ArcGIS Hub
 */
export interface IHubAggregation {
  mode: string;
  field: string;
  values: Array<{
    value: any;
    count: number;
  }>;
}
