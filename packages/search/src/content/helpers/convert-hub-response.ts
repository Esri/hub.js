import { UserSession } from "@esri/arcgis-rest-auth";
import { getProp } from "@esri/hub-common";
import { ISearchParams } from "../../ago/params";
import {
  IContentAggregations,
  IContentSearchResponse
} from "../../types/content";
import {
  IAggregation,
  IAggregationResult
} from "../../util/aggregations/merge-aggregations";

export function convertHubResponse(
  request: ISearchParams,
  response: any = { data: [], meta: {} },
  serviceSession?: UserSession
): IContentSearchResponse {
  const results: any[] = response.data.map((d: Record<string, any>) =>
    getAttributes(d)
  );
  const { count, total, hasNext, query, aggregations } = getResponseMetadata(
    response
  );
  const next: (
    userSession?: UserSession
  ) => Promise<IContentSearchResponse> = getNextFunction(
    request,
    response,
    hasNext,
    serviceSession
  );

  return {
    results,
    count,
    total,
    hasNext,
    query,
    aggregations: aggregations ? mapAggregations(aggregations) : undefined,
    next
  };
}

function mapAggregations(
  aggregations: Record<string, any> = {}
): IContentAggregations {
  return Object.keys(aggregations).reduce(
    (contentAggs: IContentAggregations, aggType: string) => {
      contentAggs.counts = mapCountAggregations(aggregations);
      return contentAggs;
    },
    {} as IContentAggregations
  );
}

function mapCountAggregations(
  countAggs: Record<string, any> = {}
): IAggregationResult[] {
  return Object.keys(countAggs).map((aggKey: string) => {
    const aggregations: IAggregation[] = countAggs[aggKey]
      ? countAggs[aggKey].map((agg: Record<string, any>) => ({
          label: agg.key,
          value: agg.docCount
        }))
      : [];

    return {
      fieldName: aggKey,
      aggregations
    };
  });
}

function getNextFunction(
  request: ISearchParams,
  response: any,
  hasNext: boolean,
  serviceSession?: UserSession
): () => Promise<IContentSearchResponse> {
  return (userSession?: UserSession) => {
    const authentication: UserSession = userSession || serviceSession;
    const headers = authentication
      ? new Headers({ authentication: JSON.stringify(authentication) })
      : undefined;
    if (hasNext) {
      return fetch(response.meta.next, {
        method: "GET",
        mode: "cors",
        headers
      })
        .then(res => res.json())
        .then(res => convertHubResponse(request, res));
    }
    const metadata: Record<string, any> = getResponseMetadata(response);
    return Promise.resolve({
      results: [],
      count: 0,
      total: metadata.total,
      hasNext: false,
      query: metadata.query,
      aggregations: metadata.aggregations
        ? mapAggregations(metadata.aggregations)
        : undefined,
      next: getNextFunction(request, response, false)
    });
  };
}

function getResponseMetadata(
  response: any = { data: [], meta: {} }
): {
  count?: number;
  total?: number;
  hasNext?: boolean;
  query?: string;
  aggregations?: Record<string, any>;
} {
  const respQuery = getProp(response, "meta.queryParameters");
  const query = respQuery ? JSON.stringify(respQuery) : undefined;
  const respAggregations = getProp(response, "meta.stats.aggs") || {};
  const aggregations =
    Object.keys(respAggregations).length > 0 ? respAggregations : undefined;
  return {
    count: getProp(response, "meta.stats.count") || 0,
    total: getProp(response, "meta.stats.totalCount") || 0,
    hasNext: !!getProp(response, "meta.next"),
    query,
    aggregations
  };
}

function getAttributes(data: Record<string, any>) {
  const attributes = getProp(data, "attributes");
  if (attributes) {
    attributes.title = attributes.name;
  }
  return attributes;
}
