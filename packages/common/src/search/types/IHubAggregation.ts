/**
 * Structure for Search Aggregations in ArcGIS Hub
 */
export interface IHubAggregation {
  /**
   * What type of aggregation is returned
   */
  mode: string;
  /**
   * Field the aggregation was creatd for
   */
  field: string;
  /**
   * Array of the field values and counts
   */
  values: Array<{
    value: any;
    count: number;
  }>;
}
