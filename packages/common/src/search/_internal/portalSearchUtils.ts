import { ISearchResult } from "@esri/arcgis-rest-portal";
import { IHubAggregation } from "../types";

/**
 * @private
 * Convert a portal aggregation structure into the HubAggregations structure
 * @param searchResults
 * @returns
 */
export function convertPortalAggregations<T>(
  searchResults: ISearchResult<T>
): IHubAggregation[] {
  if (searchResults.aggregations?.counts) {
    return searchResults.aggregations.counts.map((entry) => {
      return {
        mode: "terms",
        field: entry.fieldName,
        values: entry.fieldValues,
      };
    });
  } else {
    return [];
  }
}
