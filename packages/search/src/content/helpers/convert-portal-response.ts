import {
  IItem,
  ISearchOptions,
  ISearchResult,
  searchItems
} from "@esri/arcgis-rest-portal";
import { UserSession } from "@esri/arcgis-rest-auth";
import {
  IContentSearchResponse,
  IContentAggregations
} from "../../types/content";
import {
  IAggregation,
  IAggregationResult
} from "../../util/aggregations/merge-aggregations";
import { cloneObject } from "@esri/hub-common";

export function convertPortalResponse(
  request: ISearchOptions,
  response: ISearchResult<IItem>
): IContentSearchResponse {
  const results: IItem[] = response.results;
  const count: number = response.num;
  const total: number = response.total;
  const hasNext: boolean = response.nextStart > -1;
  const query: string = response.query;
  const aggregations: IContentAggregations = response.aggregations
    ? mapAggregations(response.aggregations)
    : undefined;
  const next: (
    userSession?: UserSession
  ) => Promise<IContentSearchResponse> = getNextFunction(
    request,
    response.nextStart,
    response.total
  );

  return {
    results,
    count,
    total,
    hasNext,
    query,
    aggregations,
    next
  };
}

function mapAggregations(
  aggregations: Record<string, any> = {}
): IContentAggregations {
  return Object.keys(aggregations).reduce(
    (contentAggs: IContentAggregations, aggType: string) => {
      if (aggType.toLowerCase() === "counts") {
        contentAggs.counts = mapCountAggregations(aggregations[aggType]);
      }
      return contentAggs;
    },
    {} as IContentAggregations
  );
}

function mapCountAggregations(
  countAggs: Array<Record<string, any>>
): IAggregationResult[] {
  return countAggs.map((agg: Record<string, any>) => {
    const mappedAggs: IAggregation[] = agg.fieldValues.map(
      (aggValue: Record<string, any>) => ({
        label: aggValue.value,
        value: aggValue.count
      })
    );

    return {
      fieldName: agg.fieldName,
      aggregations: mappedAggs
    };
  });
}

function getNextFunction(
  request: ISearchOptions,
  nextStart: number,
  total: number
): () => Promise<IContentSearchResponse> {
  const clonedRequest = cloneObject(request);
  clonedRequest.start = nextStart > -1 ? nextStart : total + 1;
  return (userSession?: UserSession) => {
    if (userSession) {
      clonedRequest.authentication = userSession;
    }
    return searchItems(clonedRequest).then((response: ISearchResult<IItem>) => {
      return convertPortalResponse(clonedRequest, response);
    });
  };
}
