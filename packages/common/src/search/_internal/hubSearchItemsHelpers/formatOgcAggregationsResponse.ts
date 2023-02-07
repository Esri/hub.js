import { IHubAggregation } from "../../types/IHubAggregation";
import { IHubSearchResponse } from "../../types/IHubSearchResponse";
import { IHubSearchResult } from "../../types/IHubSearchResult";
import { IOgcAggregationsResponse } from "./interfaces";

/**
 * Transforms an aggregations response from the OGC API into a
 * valid format IHubSearch response
 *
 * @param response aggregations response from the OGC API
 * @returns a valid IHubSearch response
 */
export function formatOgcAggregationsResponse(
  response: IOgcAggregationsResponse
): IHubSearchResponse<IHubSearchResult> {
  const aggregations: IHubAggregation[] =
    response.aggregations.aggregations.map((ogcAgg) => ({
      // What should it really be?
      mode: "terms",
      field: ogcAgg.field,
      values: ogcAgg.aggregations.map((a) => ({
        // Not confusing at all, right? Just some differences in terminology
        value: a.label,
        count: a.value,
      })),
    }));

  return {
    total: 0,
    results: [],
    hasNext: false,
    next: () => null,
    aggregations,
  };
}
